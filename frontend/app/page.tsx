"use client";

import { useState } from "react";
import ReportForm from "@/components/ReportForm";
import HistoryTab from "@/components/HistoryTab";
import ChatShell from "@/components/ChatShell";
import ChatHistoryTab from "@/components/ChatHistoryTab";
import { MessageSquareShare, MessageSquare, FileText, Clock } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "chat-history" | "form" | "history">("chat");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center flex-wrap gap-2">
          <div className="bg-slate-900/60 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-slate-800/80 inline-flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "chat" 
                  ? "bg-slate-800 shadow text-indigo-400 border border-slate-700/50" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <MessageSquareShare className="w-4.5 h-4.5" />
              <span>AI Copilot</span>
            </button>

            <button
              onClick={() => setActiveTab("chat-history")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "chat-history" 
                  ? "bg-slate-800 shadow text-indigo-400 border border-slate-700/50" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Chat History</span>
            </button>
            
            <button
              onClick={() => setActiveTab("form")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "form" 
                  ? "bg-slate-800 shadow text-indigo-400 border border-slate-700/50" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <FileText className="w-4.5 h-4.5" />
              <span>Report Builder</span>
            </button>
            
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "history" 
                  ? "bg-slate-800 shadow text-indigo-400 border border-slate-700/50" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Clock className="w-4.5 h-4.5" />
              <span>Report History</span>
            </button>
          </div>
        </div>

        {/* Content Area with smooth transitions */}
        <section className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          {activeTab === "chat" && <ChatShell />}
          {activeTab === "chat-history" && <ChatHistoryTab />}
          {activeTab === "form" && <ReportForm />}
          {activeTab === "history" && <HistoryTab />}
        </section>

      </div>
    </main>
  );
}
