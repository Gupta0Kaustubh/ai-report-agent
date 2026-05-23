from typing import Dict, Any

class QueryRouter:
    async def plan(self, text: str, intent: str, context: Dict[str, Any]) -> Dict[str, Any]:
        plan = {
            "intent": intent,
            "tools": [],
            "query": None,
            "semantic_target": "postgres",
            "analysis": [],
        }

        if intent == "analytics_query":
            plan["tools"] = ["sql_query_tool", "chart_tool"]
        elif intent == "forecasting":
            plan["tools"] = ["sql_query_tool", "forecast_tool", "chart_tool"]
        elif intent == "risk_analysis":
            plan["tools"] = ["sql_query_tool", "insights_tool"]
        elif intent == "scenario_simulation":
            plan["tools"] = ["sql_query_tool", "scenario_tool", "chart_tool"]
        else:
            plan["tools"] = ["sql_query_tool"]

        plan["query"] = self._build_query(text, intent, context)
        return plan

    def _build_query(self, text: str, intent: str, context: Dict[str, Any]) -> str:
        # 1. Search text and historical context for company
        text_lower = text.lower()
        company = None
        
        # Scan current text first
        if "nexuscorp" in text_lower or "nexus" in text_lower:
            company = "NexusCorp"
        elif "quantum" in text_lower:
            company = "Quantum Dynamics"
        elif "synthwave" in text_lower:
            company = "SynthWave AI"
        elif "zenith" in text_lower:
            company = "Zenith Networks"
        elif "orbital" in text_lower:
            company = "Orbital Logistics"
            
        # Scan historical messages if not found in current message
        if not company and context and "conversation" in context:
            for msg in reversed(context["conversation"]):
                msg_content = msg.get("content", "").lower()
                if "nexuscorp" in msg_content or "nexus" in msg_content:
                    company = "NexusCorp"
                    break
                elif "quantum" in msg_content:
                    company = "Quantum Dynamics"
                    break
                elif "synthwave" in msg_content:
                    company = "SynthWave AI"
                    break
                elif "zenith" in msg_content:
                    company = "Zenith Networks"
                    break
                elif "orbital" in msg_content:
                    company = "Orbital Logistics"
                    break
                    
        # Default to NexusCorp if still not found
        if not company:
            company = "NexusCorp"

        # 2. Search text and historical context for metric
        metric = None
        if "revenue" in text_lower:
            metric = "revenue"
        elif "user" in text_lower or "active" in text_lower:
            metric = "active_users"
        elif "production" in text_lower or "volume" in text_lower:
            metric = "production_volume"
        elif "uptime" in text_lower or "network" in text_lower:
            metric = "network_uptime"
        elif "shipping" in text_lower or "tonnage" in text_lower:
            metric = "shipping_tonnage"

        if not metric and context and "conversation" in context:
            for msg in reversed(context["conversation"]):
                msg_content = msg.get("content", "").lower()
                if "revenue" in msg_content:
                    metric = "revenue"
                    break
                elif "user" in msg_content or "active" in msg_content:
                    metric = "active_users"
                    break
                elif "production" in msg_content or "volume" in msg_content:
                    metric = "production_volume"
                    break
                elif "uptime" in msg_content or "network" in msg_content:
                    metric = "network_uptime"
                    break
                elif "shipping" in msg_content or "tonnage" in msg_content:
                    metric = "shipping_tonnage"
                    break

        # Fallback metric per company
        if not metric:
            if company == "NexusCorp":
                metric = "revenue"
            elif company == "Quantum Dynamics":
                metric = "active_users"
            elif company == "SynthWave AI":
                metric = "production_volume"
            elif company == "Zenith Networks":
                metric = "network_uptime"
            elif company == "Orbital Logistics":
                metric = "shipping_tonnage"
            else:
                metric = "revenue"

        # Construct targeted, performant query
        return f"""
            SELECT c.name as company_name, m.record_date, m.metric_name, m.metric_value
            FROM metrics_data m
            JOIN companies c ON m.company_id = c.id
            WHERE c.name ILIKE '%{company}%'
              AND m.metric_name = '{metric}'
            ORDER BY m.record_date ASC
        """.strip()
