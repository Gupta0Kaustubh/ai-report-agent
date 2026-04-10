from sqlalchemy import text
from app.db import engine

def save_report(company_id, params, report_text):
    query = text("""
        INSERT INTO generated_reports (company_id, parameters, report)
        VALUES (:company_id, :params, :report)
    """)

    with engine.connect() as conn:
        conn.execute(query, {
            "company_id": company_id,
            "params": params,
            "report": report_text
        })
        conn.commit()

def get_all_reports():
    query = text("""
        SELECT g.id, g.company_id, c.name as company_name, g.parameters, g.report, g.created_at
        FROM generated_reports g
        JOIN companies c ON g.company_id = c.id
        ORDER BY g.created_at DESC
    """)
    
    with engine.connect() as conn:
        result = conn.execute(query)
        return [dict(row._mapping) for row in result]