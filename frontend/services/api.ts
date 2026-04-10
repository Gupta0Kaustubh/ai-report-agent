import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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