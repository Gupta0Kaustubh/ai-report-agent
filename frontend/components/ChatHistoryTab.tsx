"use client";

import { useEffect, useState } from "react";
import { getConversations, getConversationDetails } from "@/services/chatApi";
import Loader from "./Loader";
import ChartRenderer from "./ChartRenderer";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Calendar, ChevronRight, ArrowLeft } from "lucide-react";

export default function ChatHistoryTab() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations("user-001");
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (session: any) => {
    setSelectedSession(session);
    setLoadingDetails(true);
    try {
      const details = await getConversationDetails(session.session_id, "user-001");
      setSelectedDetails(details);
    } catch (err) {
      console.error("Failed to load conversation details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBack = () => {
    setSelectedSession(null);
    setSelectedDetails(null);
    fetchConversations();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (selectedSession) {
    if (loadingDetails) {
      return (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      );
    }

    const messages = selectedDetails?.messages || [];
    const charts = messages
      .filter((m: any) => m.role === "assistant" && m.chart)
      .map((m: any) => m.chart);

    return (
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 space-y-6">
        <button
          onClick={handleBack}
          className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chat History</span>
        </button>

        <header className="border-b border-slate-850 pb-4">
          <h3 className="text-xl font-bold text-white">{selectedSession.title}</h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Started on {new Date(selectedSession.created_at).toLocaleString()}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
          {/* Messages Transcript */}
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <p className="text-slate-500 italic text-center py-10">No messages in this conversation.</p>
            ) : (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`p-5 rounded-3xl shadow-sm border ${
                    message.role === "user"
                      ? "bg-slate-850 border-slate-700/50 text-slate-100 ml-auto max-w-[80%]"
                      : "bg-slate-900/90 border-slate-800/80 text-slate-100 max-w-[95%]"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400 mb-1">
                    {message.role}
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-slate-200">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>

                  {message.kpis && message.kpis.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {message.kpis.map((kpi: any, idx: number) => (
                        <div
                          key={`${kpi.label}-${idx}`}
                          className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-3 flex flex-col justify-between"
                        >
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {kpi.label}
                          </span>
                          <span className="text-base font-bold text-white mt-1">
                            {typeof kpi.value === "number"
                              ? kpi.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                              : kpi.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Visualizations Panel */}
          <aside className="space-y-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Generated Visualizations</h4>
            <div className="space-y-6">
              {charts.length === 0 ? (
                <div className="bg-slate-950/20 border border-slate-850/60 rounded-3xl p-8 text-center text-slate-500 text-sm italic">
                  No charts were generated during this conversation.
                </div>
              ) : (
                charts.map((chart: any, index: number) => (
                  <ChartRenderer key={`${chart.title}-${index}`} chart={chart} />
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      {conversations.length === 0 ? (
        <div className="col-span-full bg-slate-900/40 border border-slate-800/80 rounded-3xl p-16 text-center text-slate-500 shadow-inner">
          <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-3" />
          <p className="text-lg font-medium text-slate-400">No previous copilot conversations</p>
          <p className="text-sm mt-1 text-slate-500">Your chat history will be listed here after you ask a question.</p>
        </div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.session_id}
            onClick={() => handleSelectConversation(conv)}
            className="bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/30 p-6 rounded-3xl shadow-md hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/10">
                  {conv.message_count} {conv.message_count === 1 ? "Message" : "Messages"}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(conv.created_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                {conv.title}
              </h4>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-850/80 text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
              <span>View Transcript</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
