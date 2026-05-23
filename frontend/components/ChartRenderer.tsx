"use client";

import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area } from "recharts";
import { ChartSpec } from "@/types/chat";

type ChartRendererProps = {
  chart: ChartSpec;
};

const renderChart = (chart: ChartSpec) => {
  const data = chart.data || [];
  switch (chart.chart_type) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.x_axis} />
            <YAxis />
            <Tooltip />
            {chart.y_axis.map((key) => (
              <Bar key={key} dataKey={key} fill="#6366f1" />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    case "area":
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.x_axis} />
            <YAxis />
            <Tooltip />
            {chart.y_axis.map((key) => (
              <Area key={key} type="monotone" dataKey={key} stroke="#ec4899" fill="#fda4af" />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    default:
      return (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chart.x_axis} />
            <YAxis />
            <Tooltip />
            {chart.y_axis.map((key) => (
              <Line key={key} type="monotone" dataKey={key} stroke="#22c55e" strokeWidth={3} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
  }
};

export default function ChartRenderer({ chart }: ChartRendererProps) {
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-5 shadow-xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-100">{chart.title}</h3>
        {chart.description ? <p className="text-slate-400 text-sm">{chart.description}</p> : null}
      </div>
      {renderChart(chart)}
    </div>
  );
}
