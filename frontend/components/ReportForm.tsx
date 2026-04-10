"use client";

import { useEffect, useState } from "react";
import { generateReport, getCompanies } from "@/services/api";
import Loader from "./Loader";
import ReportView from "./ReportView";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles, Calendar, Building } from "lucide-react";

export default function ReportForm() {
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-04-01");
  const [companies, setCompanies] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    getCompanies()
      .then(data => {
        setCompanies(data || []);
        if (data && data.length > 0) setCompanyName(data[0].name);
      })
      .catch(console.error);
  }, []);

  const [targetGrowth, setTargetGrowth] = useState("10"); // new UI state
  const [riskTolerance, setRiskTolerance] = useState("Moderate"); // new UI state
  const [budget, setBudget] = useState("50000"); // new UI state

  const [reportData, setReportData] = useState<{ report: string; data: any[]; ai_forecast_data?: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);
    setError("");

    try {
      const res = await generateReport({
        company_name: companyName,
        start_date: startDate,
        end_date: endDate,
        target_growth: targetGrowth,
        risk_tolerance: riskTolerance,
        budget: budget
      });

      setReportData(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Error generating report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Search Filter Card */}
      <div className="bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-slate-700 rounded-3xl p-6 md:p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3 h-3"/> Company Name
            </label>
            <select
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all p-3 rounded-xl outline-none"
              required
            >
              {companies.map(c => (
                 <option key={c.id} value={c.name} className="bg-slate-800">{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3"/> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3"/> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all p-3 rounded-xl outline-none"
              required
            />
          </div>

          {/* New Expanded Param Rows */}
          <div className="space-y-2 col-span-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               Target Growth (%)
            </label>
            <input
              type="number"
              value={targetGrowth}
              onChange={(e) => setTargetGrowth(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="space-y-2 col-span-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               Risk Tolerance
            </label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all p-3 rounded-xl outline-none"
            >
                <option value="Low" className="bg-slate-800">Low</option>
                <option value="Moderate" className="bg-slate-800">Moderate</option>
                <option value="High" className="bg-slate-800">High</option>
            </select>
          </div>

          <div className="space-y-2 col-span-1 md:col-span-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
               Budget Alloc ($)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all p-3 rounded-xl outline-none"
              required
            />
          </div>

          <div className="md:col-span-4 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader /> : <><Sparkles className="w-4 h-4"/> Generate Advanced AI Report</>}
              </button>
          </div>
        </form>

        {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
            </div>
        )}
      </div>

      {/* Results View */}
      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8">
            {/* Left Graph Panel */}
            <div className="lg:col-span-5 bg-slate-800/80 backdrop-blur-xl border border-slate-700 shadow-xl rounded-3xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                    <span className="bg-indigo-500/20 p-1.5 rounded-lg"><Line className="w-4 h-4 text-indigo-400"/></span>
                    Metric Insights
                </h3>
                
                <div className="flex-1 min-h-[300px]">
                    {!reportData.data || reportData.data.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 italic">
                            No chart data available for these parameters.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...reportData.data].sort((a,b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis 
                                dataKey="record_date" 
                                tick={{fill: '#94A3B8', fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                tick={{fill: '#94A3B8', fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#1E293B', color: '#F8FAFC', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="metric_value" 
                                stroke="#4F46E5" 
                                strokeWidth={3}
                                dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {reportData.ai_forecast_data && reportData.ai_forecast_data.length > 0 && (
                   <div className="mt-8 border-t border-slate-700/50 pt-8 flex-1 min-h-[300px]">
                      <h3 className="text-lg font-bold text-pink-400 mb-6 flex items-center gap-2">
                          <span className="bg-pink-500/20 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-pink-400"/></span>
                          AI Predictive Forecast
                      </h3>
                      <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...reportData.ai_forecast_data]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis 
                                dataKey="forecast_date" 
                                tick={{fill: '#94A3B8', fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                tick={{fill: '#94A3B8', fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#1E293B', color: '#F8FAFC', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="predicted_value" 
                                stroke="#EC4899" 
                                strokeWidth={3}
                                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            </LineChart>
                      </ResponsiveContainer>
                   </div>
                )}
            </div>

            {/* Right Report Panel */}
            <div className="lg:col-span-7 bg-slate-800/80 backdrop-blur-xl border border-slate-700 shadow-xl rounded-3xl p-8 max-h-[800px] overflow-y-auto custom-scrollbar">
                <ReportView report={reportData.report} />
            </div>
        </div>
      )}
    </div>
  );
}