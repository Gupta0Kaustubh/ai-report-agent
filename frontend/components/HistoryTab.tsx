"use client";

import { useEffect, useState } from "react";
import { getReports } from "@/services/api";
import Loader from "./Loader";
import ReportView from "./ReportView";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HistoryTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
        setLoading(true);
        const data = await getReports();
        setReports(data || []);
    } catch(err) {
        console.error("Failed to fetch reports", err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader /></div>;
  }

  if (selectedReport) {
     let chartData = [];
     let parsedParams: any = {};
     try {
       parsedParams = typeof selectedReport.parameters === 'string' 
            ? JSON.parse(selectedReport.parameters) 
            : selectedReport.parameters;
       chartData = parsedParams?.data || [];
     } catch (e) {
       console.error("Failed parsing chart payload", e);
     }

     return (
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 shadow-xl rounded-3xl p-8 transition-all animate-in fade-in slide-in-from-bottom-4">
            <button 
                onClick={() => setSelectedReport(null)}
                className="mb-6 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
                ← Back to History
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Graph Panel */}
                <div className="lg:col-span-5 bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                        <span className="bg-indigo-500/20 p-1.5 rounded-lg">
                           <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </span>
                        Historical Metrics
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        {!chartData || chartData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-500 italic">
                                No historical chart mapping available.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...chartData].sort((a,b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime())}>
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

                    {parsedParams.ai_forecast_data && parsedParams.ai_forecast_data.length > 0 && (
                       <div className="mt-8 border-t border-slate-700/50 pt-8 flex-1 min-h-[300px]">
                          <h3 className="text-lg font-bold text-pink-400 mb-6 flex items-center gap-2">
                              <span className="bg-pink-500/20 p-1.5 rounded-lg"><svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="m3 12 18-18"/><path d="m21 12-18 18"/></svg></span>
                              AI Predictive Forecast
                          </h3>
                          <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...parsedParams.ai_forecast_data]}>
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
                <div className="lg:col-span-7 max-h-[800px] overflow-y-auto custom-scrollbar">
                   <ReportView report={selectedReport.report} />
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
        {reports.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-500">
                No past reports generated yet.
            </div>
        ) : (
            reports.map(rep => (
                <div 
                    key={rep.id} 
                    onClick={() => setSelectedReport(rep)}
                    className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-indigo-500/10 hover:border-slate-600 transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-semibold rounded-full">
                            Company: {rep.company_name}
                        </span>
                        <span className="text-slate-500 text-xs">
                            {new Date(rep.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-3 group-hover:text-slate-300 transition-colors">
                        {rep.report}
                    </p>
                </div>
            ))
        )}
    </div>
  );
}
