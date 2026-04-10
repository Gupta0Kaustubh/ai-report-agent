from sqlalchemy import text
from app.db import engine

def get_all_companies():
    query = text("SELECT id, name FROM companies ORDER BY name ASC")
    with engine.connect() as conn:
        result = conn.execute(query)
        return [{"id": row._mapping["id"], "name": row._mapping["name"]} for row in result]

def fetch_metrics(company_name, start_date, end_date):
    query = text("""
        SELECT c.id as company_id, m.metric_name, m.metric_value, m.record_date
        FROM metrics_data m
        JOIN companies c ON m.company_id = c.id
        WHERE c.name ILIKE :company_name
        AND m.record_date BETWEEN :start_date AND :end_date
        ORDER BY m.record_date ASC
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {
            "company_name": f"%{company_name}%",
            "start_date": start_date,
            "end_date": end_date
        })

        data = []
        for row in result:
            row_dict = dict(row._mapping)
            if 'record_date' in row_dict and row_dict['record_date']:
                row_dict['record_date'] = str(row_dict['record_date'])
            if 'metric_value' in row_dict and row_dict['metric_value'] is not None:
                row_dict['metric_value'] = float(row_dict['metric_value'])
            data.append(row_dict)
            
        return data