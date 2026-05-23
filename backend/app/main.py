import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.report_schema import ReportRequest
from app.services.data_service import fetch_metrics, get_all_companies
from app.services.crew_service import generate_report_with_crew
from app.services.report_service import save_report, get_all_reports
from app.routers.chat import router as chat_router

app = FastAPI()
app.include_router(chat_router)

import os
from sqlalchemy import text
from app.db import engine

@app.on_event("startup")
def startup_event():
    seed_path = os.path.join(os.path.dirname(__file__), "../../database/seed.sql")
    schema_path = os.path.join(os.path.dirname(__file__), "../../database/schema.sql")
    try:
        with engine.begin() as conn:
            # Safely create tables if missing
            table_check = conn.execute(text("SELECT to_regclass('public.companies')")).scalar()
            if not table_check and os.path.exists(schema_path):
                with open(schema_path, 'r') as f:
                    statements = f.read().split(';')
                    for stmt in statements:
                        if stmt.strip(): conn.execute(text(stmt))
            
            # Seed data if completely empty
            count = conn.execute(text("SELECT count(*) FROM metrics_data")).scalar()
            if count == 0 and os.path.exists(seed_path):
                with open(seed_path, 'r') as f:
                    statements = f.read().split(';')
                    for stmt in statements:
                        if stmt.strip(): conn.execute(text(stmt))
    except Exception as e:
        print(f"Startup DB Injection Exception safely bypassed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI Report Agent Running"}


@app.post("/generate-report")
def generate_report(req: ReportRequest):

    # Step 1: Fetch data
    data = fetch_metrics(req.company_name, req.start_date, req.end_date)

    if not data:
        return {"report": "No data found for given inputs"}

    resolved_company_id = data[0].get("company_id")

    # Step 2: Generate report via CrewAI
    ai_payload = generate_report_with_crew(
        data, 
        req.company_name, 
        req.target_growth, 
        req.risk_tolerance, 
        req.budget
    )
    report_md = ai_payload["report"]
    ai_forecast_data = ai_payload["ai_forecast_data"]

    # Step 3: Save report
    if resolved_company_id:
        param_payload = {
            "req": req.model_dump() if hasattr(req, "model_dump") else req.dict(),
            "data": data,
            "ai_forecast_data": ai_forecast_data
        }
        save_report(
            resolved_company_id,
            json.dumps(param_payload),
            str(report_md)
        )

    return {"report": str(report_md), "data": data, "ai_forecast_data": ai_forecast_data}

@app.get("/reports")
def list_reports():
    return get_all_reports()

@app.get("/companies")
def list_companies():
    return get_all_companies()