from typing import Any, Dict

class InsightsTool:
    name = "insights_tool"

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        query_data = payload.get("data", [])
        insights = []
        if query_data:
            insights.append({"label": "Data points", "value": len(query_data)})
            insights.append({"label": "Top metric", "value": query_data[0].get("metric_name")})

        return {
            "tool": self.name,
            "status": "ok",
            "kpis": insights,
            "metadata": {"analysis": "basic_insight"},
        }
