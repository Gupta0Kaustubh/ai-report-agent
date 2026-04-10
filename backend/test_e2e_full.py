import urllib.request
import json

data = json.dumps({
    "company_name": "NexusCorp",
    "start_date": "2024-01-01",
    "end_date": "2024-04-01",
    "target_growth": "25",
    "risk_tolerance": "High",
    "budget": "50000"
}).encode('utf-8')

req = urllib.request.Request("http://localhost:8000/generate-report", data=data, headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    out = response.read().decode('utf-8')
    print("STATUS: 200 OK")
    print("KEYS:", json.loads(out).keys())
    print("AI DATA:", json.loads(out).get("ai_forecast_data"))
except Exception as e:
    print("ERROR:", e)
