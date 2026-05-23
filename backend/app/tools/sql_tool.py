from typing import Any, Dict, List
import asyncio
from concurrent.futures import ThreadPoolExecutor
from sqlalchemy import text
from app.db import engine

class SQLTool:
    name = "sql_query_tool"

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        query_text = payload.get("query")
        if not query_text:
            return {"tool": self.name, "status": "error", "message": "Missing query text"}

        loop = asyncio.get_event_loop()
        executor = ThreadPoolExecutor()
        try:
            data = await loop.run_in_executor(executor, self._sync_execute, query_text, payload.get("params", {}))
            return {"tool": self.name, "status": "ok", "data": data}
        except Exception as e:
            return {"tool": self.name, "status": "error", "message": str(e)}

    def _sync_execute(self, query_text: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        with engine.connect() as conn:
            result = conn.execute(text(query_text), params)
            data = [dict(row._mapping) for row in result]
        return data
