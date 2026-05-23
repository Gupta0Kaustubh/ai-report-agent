from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

class ChartSpec(BaseModel):
    chart_type: str
    title: str
    description: Optional[str] = None
    data: List[Dict[str, Any]]
    x_axis: str
    y_axis: List[str]
    dimensions: Optional[List[str]] = None
    aggregations: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatMessage(BaseModel):
    id: str
    role: Literal["user", "assistant", "system", "tool"]
    content: str
    created_at: str
    chart: Optional[ChartSpec] = None
    kpis: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    session_id: str
    user_id: str
    message: str
    conversation_id: Optional[str] = None
    channel: Optional[str] = Field(default="web")
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    session_id: str
    conversation_id: str
    messages: List[ChatMessage]
    charts: Optional[List[ChartSpec]] = None
    semantic_intent: Optional[str] = None
    tool_results: Optional[List[Dict[str, Any]]] = None
    warnings: Optional[List[str]] = None
    stream_token: Optional[str] = None
