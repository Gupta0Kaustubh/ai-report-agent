from typing import Dict

class IntentRouter:
    def detect(self, text: str, context: Dict[str, any]) -> str:
        normalized = text.strip().lower()
        if "what if" in normalized or "scenario" in normalized:
            return "scenario_simulation"
        if "forecast" in normalized or "predict" in normalized:
            return "forecasting"
        if "risk" in normalized or "risk tolerance" in normalized:
            return "risk_analysis"
        if "summary" in normalized or "insight" in normalized:
            return "executive_summary"
        return "analytics_query"
