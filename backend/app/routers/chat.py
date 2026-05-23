from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage
from app.services.chat_service import ChatService
from app.services.conversation_service import ConversationService
from uuid import uuid4
from datetime import datetime
import logging

router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        return await ChatService().handle_chat(request)
    except Exception as e:
        logging.error(f"Error in chat endpoint: {e}", exc_info=True)
        error_msg = ChatMessage(
            id=str(uuid4()),
            role="assistant",
            content=f"An error occurred while processing your analytics request: {str(e)}. Please try rephrasing or double-checking the system state.",
            created_at=datetime.utcnow().isoformat() + "Z"
        )
        return ChatResponse(
            session_id=request.session_id,
            conversation_id=request.conversation_id or request.session_id,
            messages=[error_msg],
            warnings=[str(e)]
        )

@router.get("/conversations")
async def list_conversations(user_id: str = "user-001"):
    return ConversationService().list_sessions(user_id)

@router.get("/conversations/{session_id}")
async def get_conversation(session_id: str, user_id: str = "user-001"):
    return ConversationService().recall_session(session_id, user_id)
