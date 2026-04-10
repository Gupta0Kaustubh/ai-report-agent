from pydantic import BaseModel

class ReportRequest(BaseModel):
    company_name: str
    start_date: str
    end_date: str
    target_growth: str
    risk_tolerance: str
    budget: str


class ReportResponse(BaseModel):
    report: str