from typing import List, Dict, Any, Optional
from uuid import uuid4
from datetime import datetime

from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage, ChartSpec
from app.services.intent_router import IntentRouter
from app.services.query_router import QueryRouter
from app.services.tool_registry import ToolRegistry
from app.services.llm_adapter import LLMAdapter
from app.services.conversation_service import ConversationService

class ChatService:
    def __init__(self):
        self.intent_router = IntentRouter()
        self.query_router = QueryRouter()
        self.tool_registry = ToolRegistry()
        self.llm_adapter = LLMAdapter()
        self.conversation_service = ConversationService()

    async def handle_chat(self, request: ChatRequest) -> ChatResponse:
        session = self.conversation_service.recall_session(request.session_id, request.user_id)
        context = self.conversation_service.build_context(session, request.message)

        intent = self.intent_router.detect(request.message, context)
        plan = await self.query_router.plan(request.message, intent, context)

        tool_results = []
        query_data = []
        for tool in self.tool_registry.resolve(plan):
            payload = {
                "query": plan.get("query"),
                "intent": intent,
                "context": context,
                "plan": plan,
                "data": query_data,
            }
            result = await tool.execute(payload)
            if tool.name == "sql_query_tool" and result.get("status") == "ok":
                query_data = result.get("data", [])
                # Update payload's data immediately in case it is accessed downstream
                payload["data"] = query_data
            tool_results.append(result)

        prompt = self._build_prompt(request.message, context, intent, tool_results)
        assistant_text = await self.llm_adapter.generate(
            prompt, 
            metadata={"intent": intent, "tool_results": tool_results}
        )

        raw_chart = None
        for result in tool_results:
            if result.get("chart"):
                raw_chart = result["chart"]
                break

        assistant_message = ChatMessage(
            id=str(uuid4()),
            role="assistant",
            content=assistant_text,
            created_at=datetime.utcnow().isoformat() + "Z",
            chart=self._extract_chart(tool_results),
            kpis=self._extract_kpis(tool_results),
            metadata={"intent": intent, "tools": [r.get("tool") for r in tool_results]},
        )

        self.conversation_service.record_message(session, "user", request.message, {"intent": intent})
        self.conversation_service.record_message(
            session, 
            "assistant", 
            assistant_text, 
            metadata={"tools": [r.get("tool") for r in tool_results]},
            chart=raw_chart,
            kpis=assistant_message.kpis
        )

        return ChatResponse(
            session_id=session["session_id"],
            conversation_id=request.conversation_id or session["session_id"],
            messages=[assistant_message],
            charts=[assistant_message.chart] if assistant_message.chart else None,
            semantic_intent=intent,
            tool_results=tool_results,
        )

    def _build_prompt(self, message: str, context: Dict[str, Any], intent: str, tool_results: List[Dict[str, Any]]) -> str:
        summary = "".join([f"Tool {r.get('tool')} returned {len(r.get('data', []))} records.\n" for r in tool_results])
        return (
            f"You are an enterprise analytics copilot.\n"
            f"User asked: {message}\n"
            f"Intent: {intent}\n"
            f"Context: {context.get('conversation')[-5:] if context.get('conversation') else []}\n"
            f"Tool outputs:\n{summary}\n"
            f"Compose an executive summary, KPI recommendations, and a suggested chart definition."
        )

    def _extract_chart(self, tool_results: List[Dict[str, Any]]) -> Optional[ChartSpec]:
        if not tool_results:
            return None
        for result in tool_results:
            if result.get("chart"):
                return ChartSpec(**result["chart"])
        return None

    def _extract_kpis(self, tool_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        all_kpis = []
        for result in tool_results:
            if result.get("kpis"):
                all_kpis.extend(result["kpis"])
        return all_kpis
