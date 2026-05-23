from typing import Any, Dict, Optional
from app.services.mcp_service import MCPService
from app.tools.sql_tool import SQLTool

class SemanticQueryService:
    def __init__(self):
        self.sql_tool = SQLTool()
        self.mcp_service = MCPService()

    async def execute(self, request: Dict[str, Any], target: str = "postgres") -> Dict[str, Any]:
        if target == "postgres":
            return await self.sql_tool.execute(request)
        if target == "mcp":
            return await self.mcp_service.query_semantic_model(request)
        return {"status": "error", "message": f"unknown target {target}"}

    async def explain(self, natural_language: str, target: str = "postgres") -> Dict[str, Any]:
        if target == "postgres":
            return {"status": "ok", "sql": self._natural_to_sql(natural_language)}
        return await self.mcp_service.translate_to_dax(natural_language)

    def _natural_to_sql(self, text: str) -> str:
        return "SELECT record_date, metric_name, metric_value FROM metrics_data ORDER BY record_date ASC"
