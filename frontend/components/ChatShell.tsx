"use client";

import { useMemo, useState } from "react";
import { ChatMessage, ChatRequest, ChatResponse } from "@/types/chat";
import { sendChatMessage } from "@/services/chatApi";
import ChartRenderer from "./ChartRenderer";
import ReactMarkdown from "react-markdown";

export default function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [conversationId] = useState(() => `conversation-${Date.now()}`);

  const lastCharts = useMemo(
    () => messages.filter((message) => message.role === "assistant" && message.chart).map((message) => message.chart!),
    [messages]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload: ChatRequest = {
        session_id: sessionId,
        user_id: "user-001",
        conversation_id: conversationId,
        message: input,
      };
      const response: ChatResponse = await sendChatMessage(payload);
      const assistantMessages = response.messages.map((message) => ({
        ...message,
        id: message.id,
      }));
      setMessages((current) => [...current, ...assistantMessages]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I could not process that request.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 text-transparent">Portfolio Intelligence Copilot</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">Ask questions conversationally, receive charts, exec summaries, forecasting, and scenario simulation.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-6">
          <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl min-h-[480px] flex flex-col justify-between">
            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
              {messages.length === 0 ? (
                <div className="text-slate-500 text-center py-20">
                  <p className="text-lg">Welcome to the Portfolio Intelligence Copilot.</p>
                  <p className="text-sm mt-2 text-slate-600">Try asking: "What is the forecast for NexusCorp?" or "What if budget increases by 20%?"</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`p-5 rounded-3xl shadow-sm border ${message.role === "user" ? "bg-slate-850 border-slate-700/50 text-slate-100 ml-auto max-w-[80%]" : "bg-slate-900/90 border-slate-800/80 text-slate-100 max-w-[95%]"}`}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400 mb-1">{message.role}</div>
                    <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-slate-200">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    {message.kpis && message.kpis.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {message.kpis.map((kpi, idx) => (
                          <div key={`${kpi.label}-${idx}`} className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-3 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                            <span className="text-base font-bold text-white mt-1">
                              {typeof kpi.value === 'number' 
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
          </section>

          <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-3xl p-4 flex gap-3 shadow-lg">
            <input
              className="flex-1 bg-slate-950/70 text-slate-100 rounded-2xl border border-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ask the copilot about revenue, forecasts, scenarios, or historical insights..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={loading}
            />
            <button type="submit" className="rounded-2xl bg-indigo-500 px-6 py-3 text-white shadow-lg hover:bg-indigo-400 disabled:opacity-70" disabled={loading}>
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-200 mb-4 tracking-wide">Live Visualizations</h2>
            <div className="space-y-6">
              {lastCharts.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 text-center text-slate-500 text-sm backdrop-blur-sm shadow-inner">
                  Charts and visual analytics generated by the copilot will appear here.
                </div>
              ) : (
                lastCharts.map((chart, index) => <ChartRenderer key={`${chart.title}-${index}`} chart={chart} />)
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
