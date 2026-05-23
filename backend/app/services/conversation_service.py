from typing import Any, Dict, List, Optional
from datetime import datetime

class ConversationService:
    # Shared class variable to persist sessions across service instantiations
    sessions: Dict[str, Dict[str, Any]] = {}

    def recall_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "session_id": session_id,
                "user_id": user_id,
                "messages": [],
                "memory": {},
                "created_at": datetime.utcnow().isoformat() + "Z",
                "title": "New Conversation"
            }
        return self.sessions[session_id]

    def record_message(
        self, 
        session: Dict[str, Any], 
        role: str, 
        content: str, 
        metadata: Optional[Dict[str, Any]] = None,
        chart: Optional[Dict[str, Any]] = None,
        kpis: Optional[List[Dict[str, Any]]] = None
    ) -> None:
        session["messages"].append({
            "role": role,
            "content": content,
            "metadata": metadata or {},
            "chart": chart,
            "kpis": kpis
        })
        # Auto-title conversation from first user query
        if role == "user" and len(session["messages"]) <= 2:
            session["title"] = content[:45] + ("..." if len(content) > 45 else "")

    def build_context(self, session: Dict[str, Any], incoming_message: str) -> Dict[str, Any]:
        return {
            "session_id": session["session_id"],
            "user_id": session["user_id"],
            "conversation": session["messages"],
            "memory": session.get("memory", {}),
            "incoming_message": incoming_message,
        }

    def list_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        user_sessions = [
            {
                "session_id": s["session_id"],
                "user_id": s["user_id"],
                "title": s.get("title", "Conversation"),
                "created_at": s.get("created_at", ""),
                "message_count": len(s["messages"])
            }
            for s in self.sessions.values()
            if s["user_id"] == user_id
        ]
        return sorted(user_sessions, key=lambda x: x.get("created_at", ""), reverse=True)
