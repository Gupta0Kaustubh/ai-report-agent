import requests

try:
    res = requests.post("http://localhost:8000/generate-report", json={
        "company_name": "NexusCorp",
        "start_date": "2024-01-01",
        "end_date": "2024-04-01"
    })
    print("STATUS:", res.status_code)
    try:
        print("JSON:", res.json())
    except:
        print("TEXT:", res.text)
except Exception as e:
    print("ERROR:", e)
