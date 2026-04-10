from app.db import engine
from sqlalchemy import text

def seed_and_test():
    with engine.begin() as conn:
        conn.execute(text("INSERT INTO companies (id, name, industry) VALUES (77, 'NexusCorp', 'Testing') ON CONFLICT DO NOTHING"))
        conn.execute(text("INSERT INTO metrics_data (company_id, metric_name, metric_value, record_date) VALUES (77, 'test_val', 100, '2024-02-01')"))
    
    import urllib.request
    import json
    
    data = json.dumps({
        "company_name": "NexusCorp",
        "start_date": "2024-01-01",
        "end_date": "2024-04-01"
    }).encode('utf-8')
    
    req = urllib.request.Request("http://localhost:8000/generate-report", data=data, headers={'Content-Type': 'application/json'})
    try:
        response = urllib.request.urlopen(req)
        print("STATUS:", response.status)
        print("OUTPUT:", response.read().decode('utf-8')[:500])  # print first 500 chars to avoid flood
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    seed_and_test()
