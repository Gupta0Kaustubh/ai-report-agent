import axios from "axios";

let rawURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
if (rawURL.endsWith("/")) {
  rawURL = rawURL.slice(0, -1);
}
// Strip /api from baseURL if present because root endpoints (/companies, /reports, /generate-report) are not prefixed with /api
const baseAPIURL = rawURL.endsWith("/api") ? rawURL.slice(0, -4) : rawURL;

const API = axios.create({
  baseURL: baseAPIURL,
});

export const generateReport = async (payload: any) => {
  const res = await API.post("/generate-report", payload);
  return res.data;
};

export const getReports = async () => {
  const res = await API.get("/reports");
  return res.data;
};

export const getCompanies = async () => {
  const res = await API.get("/companies");
  return res.data;
};