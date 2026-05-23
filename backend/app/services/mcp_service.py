from typing import Any, Dict, Optional

class MCPService:
    def __init__(self):
        self.provider = "fabric"
        self.endpoint = None
        self.api_key = None

    async def query_semantic_model(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.endpoint:
            return {"status": "unavailable", "message": "MCP connector not configured"}
        return {"status": "ok", "data": []}

    async def translate_to_dax(self, natural_language: str) -> Dict[str, Any]:
        return {"status": "ok", "dax": "EVALUATE ..."}

    async def fetch_model_metadata(self) -> Dict[str, Any]:
        return {"status": "ok", "models": []}
