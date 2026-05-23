from typing import Dict, List, Any
from app.tools.sql_tool import SQLTool
from app.tools.forecast_tool import ForecastTool
from app.tools.scenario_tool import ScenarioTool
from app.tools.chart_tool import ChartTool
from app.tools.insights_tool import InsightsTool

class ToolRegistry:
    def __init__(self):
        self.tools = {
            "sql_query_tool": SQLTool(),
            "forecast_tool": ForecastTool(),
            "scenario_tool": ScenarioTool(),
            "chart_tool": ChartTool(),
            "insights_tool": InsightsTool(),
        }

    def resolve(self, plan: Dict[str, Any]) -> List[Any]:
        return [self.tools[name] for name in plan.get("tools", []) if name in self.tools]

    async def execute(self, tool_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        tool = self.tools.get(tool_name)
        if tool is None:
            return {"tool": tool_name, "status": "missing"}
        return await tool.execute(payload)
