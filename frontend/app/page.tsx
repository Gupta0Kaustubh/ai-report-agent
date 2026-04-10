"use client";

import { useState } from "react";
import ReportForm from "@/components/ReportForm";
import HistoryTab from "@/components/HistoryTab";
import { FileText, Clock } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-slate-100 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Nexus AI Insights
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Harness the power of CrewAI to dynamically analyze massive metric datasets and generate precise executive reports instantly.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-slate-800/60 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-700/50 inline-flex space-x-2">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "generate" 
                  ? "bg-slate-700 shadow text-indigo-300" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "history" 
                  ? "bg-slate-700 shadow text-indigo-300" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Past Reports</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <section className="transition-all duration-500">
          {activeTab === "generate" ? <ReportForm /> : <HistoryTab />}
        </section>

      </div>
    </main>
  );
}