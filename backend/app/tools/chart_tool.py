from typing import Any, Dict

class ChartTool:
    name = "chart_tool"

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        rows = payload.get("data", [])
        if not rows:
            rows = []

        return {
            "tool": self.name,
            "status": "ok",
            "chart": {
                "chart_type": "line",
                "title": "Dynamic Metrics Visualization",
                "description": "A recommended chart generated from the query payload.",
                "data": rows,
                "x_axis": "record_date",
                "y_axis": ["metric_value"],
            },
        }
