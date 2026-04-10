from pydantic import BaseModel

class ReportRequest(BaseModel):
    company_name: str
    start_date: str
    end_date: str


class ReportResponse(BaseModel):
    report: str