export interface ReportRequest {
  company_id: number;
  start_date: string;
  end_date: string;
}

export interface ReportResponse {
  report: string;
}