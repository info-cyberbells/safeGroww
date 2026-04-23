"use client"

import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, BarChart2,
  Activity, Eye, Play, Pause, X, Edit3,
  CheckCircle, AlertCircle, Clock, Zap
} from "lucide-react";
import ViewLayout from "../../../components/ViewLayout/ViewLayout";

const equityData = [
  { day: "Mon", value: 98200 }, { day: "Tue", value: 99100 },
  { day: "Wed", value: 97800 }, { day: "Thu", value: 100400 },
  { day: "Fri", value: 102100 }, { day: "Sat", value: 101300 },
  { day: "Sun", value: 104800 },
];

const pnlData = [
  { day: "Mon", pnl: 320 }, { day: "Tue", pnl: 900 },
  { day: "Wed", pnl: -1300 }, { day: "Thu", pnl: 2600 },
  { day: "Fri", pnl: 1700 }, { day: "Sat", pnl: -800 },
  { day: "Sun", pnl: 3500 },
];

const winLossData = [
  { name: "Win", value: 68 },
  { name: "Loss", value: 32 },
];

const strategies = [
  { name: "NIFTY Momentum", status: "Running", pnl: 2840, pnlPct: 2.84 },
  { name: "BTC Scalper", status: "Paused", pnl: -420, pnlPct: -0.42 },
  { name: "ETH Mean Rev", status: "Running", pnl: 1120, pnlPct: 1.12 },
  { name: "Gold Breakout", status: "Error", pnl: 0, pnlPct: 0 },
];

const watchlist = [
  { symbol: "BTC", name: "Bitcoin", price: 67420, change: 2.34, spark: [64, 65, 63, 66, 67, 65, 67] },
  { symbol: "ETH", name: "Ethereum", price: 3480, change: -1.12, spark: [35, 34, 36, 34, 33, 34, 35] },
  { symbol: "NIFTY", name: "Nifty 50", price: 22340, change: 0.78, spark: [221, 222, 221, 223, 222, 223, 224] },
  { symbol: "GOLD", name: "Gold", price: 2318, change: -0.34, spark: [23, 23, 24, 23, 23, 23, 23] },
  { symbol: "SOL", name: "Solana", price: 168, change: 5.21, spark: [15, 16, 15, 16, 17, 16, 17] },
];

const positions = [
  { asset: "BTC/USDT", entry: 66100, current: 67420, qty: 0.5, pnl: 660, status: "Open" },
  { asset: "ETH/USDT", entry: 3520, current: 3480, qty: 2, pnl: -80, status: "Open" },
  { asset: "NIFTY FUT", entry: 22100, current: 22340, qty: 1, pnl: 240, status: "Open" },
  { asset: "GOLD", entry: 2330, current: 2318, qty: 3, pnl: -36, status: "Open" },
];

const logs: { time: string; event: string; type: string; status: LogStatus }[] = [
  { time: "14:32:01", event: "BTC/USDT Buy @ 66100", type: "trade", status: "success" },
  { time: "13:15:44", event: "NIFTY Strategy resumed", type: "system", status: "info" },
  { time: "12:48:22", event: "ETH/USDT Sell @ 3560 — profit ₹480", type: "trade", status: "success" },
  { time: "11:30:05", event: "Gold Breakout strategy error", type: "system", status: "error" },
  { time: "10:02:18", event: "BTC Scalper paused by user", type: "system", status: "warning" },
  { time: "09:15:00", event: "Market session opened", type: "system", status: "info" },
];

const PIE_COLORS = ["#0066cc", "#ced4da"];

type SparklineProps = {
  data: number[];
  positive: boolean;
};

function Sparkline({ data, positive }: SparklineProps) {
  const min = Math.min(...data), max = Math.max(...data);
  const norm = data.map(v => ((v - min) / (max - min || 1)) * 28);
  const pts = norm.map((v, i) => `${(i / (data.length - 1)) * 56},${28 - v}`).join(" ");
  return (
    <svg width="56" height="28" viewBox="0 0 56 28">
      <polyline points={pts} fill="none" stroke={positive ? "#16a34a" : "#d9413e"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type StrategyStatus = "Running" | "Paused" | "Error";

function StatusBadge({ status }: { status: StrategyStatus }) {
  const map: Record<StrategyStatus, string> = {
    Running: "bg-green-100 text-green-700",
    Paused:  "bg-yellow-100 text-yellow-700",
    Error:   "bg-red-100 text-red-700",
  };

  const dot: Record<StrategyStatus, string> = {
    Running: "bg-green-500 animate-pulse",
    Paused:  "bg-yellow-500",
    Error:   "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

type LogStatus = "success" | "error" | "warning" | "info";

function LogIcon({ status }: { status: LogStatus }) {
  if (status === "success") return <CheckCircle size={15} className="text-green-600 flex-shrink-0" />;
  if (status === "error")   return <AlertCircle size={15} className="text-red-500 flex-shrink-0" />;
  if (status === "warning") return <AlertCircle size={15} className="text-yellow-500 flex-shrink-0" />;
  return <Clock size={15} className="text-blue-500 flex-shrink-0" />;
}

export default function Dashboard() {
  const [strategyStates, setStrategyStates] = useState<Record<string, StrategyStatus>>(
    Object.fromEntries(
        strategies.map(s => [s.name, s.status as StrategyStatus])
    )
    );

  const toggleStrategy = (name: string) => {
    setStrategyStates(prev => ({
      ...prev,
      [name]: prev[name] === "Running" ? "Paused" : prev[name] === "Paused" ? "Running" : prev[name],
    }));
  };

  return (
    <ViewLayout initialRole="user">
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen text-[#7c7e8c]">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#495057] mt-0.5">Live portfolio overview · Updated just now</p>
      </div>

      {/* 1. Portfolio Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Balance", value: "₹1,04,820", sub: "+₹3,500 today", icon: <Wallet size={18} />, up: true },
          { label: "Daily PnL", value: "+₹3,500", sub: "+3.45% today", icon: <TrendingUp size={18} />, up: true },
          { label: "Overall Return", value: "+18.4%", sub: "Since inception", icon: <BarChart2 size={18} />, up: true },
          { label: "Available Margin", value: "₹42,300", sub: "40.3% free", icon: <Activity size={18} />, up: null },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-[#e9ecef] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#495057]">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.up === true ? "bg-[#e7f3ff] text-[#0066cc]" : card.up === false ? "bg-red-50 text-red-500" : "bg-[#f1f3f5] text-[#495057]"}`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-xl font-bold font-mono ${card.up === true ? "text-[#16a34a]" : card.up === false ? "text-[#d9413e]" : "text-[#111111]"}`}>
              {card.value}
            </div>
            <div className="text-xs text-[#495057] mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* 2. Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Equity Curve */}
        <div className="lg:col-span-1 bg-white rounded-xl p-4 border border-[#e9ecef] shadow-sm">
          <h2 className="text-sm font-semibold text-[#111111] mb-3 flex items-center gap-2"><TrendingUp size={15} className="text-[#0066cc]" /> Equity Curve</h2>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={equityData}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#495057" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e9ecef" }} formatter={v => [`₹${v}`, "Balance"]} />
              <Line type="monotone" dataKey="value" stroke="#0066cc" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily PnL */}
        <div className="lg:col-span-1 bg-white rounded-xl p-4 border border-[#e9ecef] shadow-sm">
          <h2 className="text-sm font-semibold text-[#111111] mb-3 flex items-center gap-2"><BarChart2 size={15} className="text-[#0066cc]" /> Daily PnL</h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={pnlData} barSize={14}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#495057" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e9ecef" }} formatter={v => [`₹${v}`, "PnL"]} />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {pnlData.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? "#16a34a" : "#d9413e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win/Loss Ratio */}
        <div className="lg:col-span-1 bg-white rounded-xl p-4 border border-[#e9ecef] shadow-sm flex flex-col">
          <h2 className="text-sm font-semibold text-[#111111] mb-3 flex items-center gap-2"><Zap size={15} className="text-[#0066cc]" /> Win / Loss Ratio</h2>
          <div className="flex items-center justify-center flex-1 gap-6">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={winLossData} cx="50%" cy="50%" innerRadius={30} outerRadius={46} dataKey="value" strokeWidth={0}>
                  {winLossData.map((_, i) => <Cell key={i} fill={i === 0 ? "#0066cc" : "#dee2e6"} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0066cc]" />
                <span className="text-[#495057]">Win</span>
                <span className="font-bold text-[#16a34a] font-mono">68%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dee2e6]" />
                <span className="text-[#495057]">Loss</span>
                <span className="font-bold text-[#d9413e] font-mono">32%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 & 4: Strategies + Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

        {/* Active Strategies */}
        <div className="bg-white rounded-xl border border-[#e9ecef] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e9ecef] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#111111] flex items-center gap-2"><Activity size={15} className="text-[#0066cc]" /> Active Strategies</h2>
            <span className="text-xs text-[#495057]">{strategies.length} total</span>
          </div>
          <div className="divide-y divide-[#f1f3f5]">
            {strategies.map((s) => {
            const state: StrategyStatus = strategyStates[s.name];
              const canToggle = state !== "Error";
              return (
                <div key={s.name} className="px-4 py-3 flex items-center gap-3 hover:bg-[#f8f9fa] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#111111] truncate">{s.name}</span>
                      <StatusBadge status={state} />
                    </div>
                    <span className={`text-xs font-mono font-semibold ${s.pnl >= 0 ? "text-[#16a34a]" : "text-[#d9413e]"}`}>
                      {s.pnl >= 0 ? "+" : ""}₹{s.pnl} ({s.pnlPct >= 0 ? "+" : ""}{s.pnlPct}%)
                    </span>
                  </div>
                  <button
                    onClick={() => canToggle && toggleStrategy(s.name)}
                    disabled={!canToggle}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      !canToggle ? "bg-[#f1f3f5] text-[#ced4da] cursor-not-allowed" :
                      state === "Running" ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-[#e7f3ff] text-[#0066cc] hover:bg-blue-100"
                    }`}
                  >
                    {state === "Running" ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Watchlist */}
        <div className="bg-white rounded-xl border border-[#e9ecef] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e9ecef] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#111111] flex items-center gap-2"><Eye size={15} className="text-[#0066cc]" /> Watchlist</h2>
            <span className="text-xs text-[#495057]">{watchlist.length} assets</span>
          </div>
          <div className="divide-y divide-[#f1f3f5]">
            {watchlist.map((asset) => {
              const up = asset.change >= 0;
              return (
                <div key={asset.symbol} className="px-4 py-3 flex items-center gap-3 hover:bg-[#f8f9fa] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#e7f3ff] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#0066cc]">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#111111]">{asset.symbol}</div>
                    <div className="text-xs text-[#495057]">{asset.name}</div>
                  </div>
                  <Sparkline data={asset.spark} positive={up} />
                  <div className="text-right">
                    <div className="text-sm font-mono font-semibold text-[#111111]">
                      {asset.price.toLocaleString()}
                    </div>
                    <div className={`text-xs font-mono font-semibold flex items-center justify-end gap-0.5 ${up ? "text-[#16a34a]" : "text-[#d9413e]"}`}>
                      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {up ? "+" : ""}{asset.change}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Open Positions Table */}
      <div className="bg-white rounded-xl border border-[#e9ecef] shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-[#e9ecef]">
          <h2 className="text-sm font-semibold text-[#111111] flex items-center gap-2"><BarChart2 size={15} className="text-[#0066cc]" /> Open Positions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8f9fa] text-xs text-[#495057] font-semibold">
                {["Asset", "Entry Price", "Current Price", "Qty", "PnL", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f5]">
              {positions.map((pos, i) => {
                const up = pos.pnl >= 0;
                return (
                  <tr key={i} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#111111]">{pos.asset}</td>
                    <td className="px-4 py-3 font-mono text-[#495057]">{pos.entry.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-[#111111] font-medium">{pos.current.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-[#495057]">{pos.qty}</td>
                    <td className={`px-4 py-3 font-mono font-bold ${up ? "text-[#16a34a]" : "text-[#d9413e]"}`}>
                      {up ? "+" : ""}₹{pos.pnl}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e7f3ff] text-[#0066cc] rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />{pos.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1">
                          <X size={11} /> Close
                        </button>
                        <button className="px-2.5 py-1 rounded-lg bg-[#e7f3ff] text-[#0066cc] text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1">
                          <Edit3 size={11} /> Modify
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Recent Activity / Logs */}
      <div className="bg-white rounded-xl border border-[#e9ecef] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e9ecef]">
          <h2 className="text-sm font-semibold text-[#111111] flex items-center gap-2"><Clock size={15} className="text-[#0066cc]" /> Recent Activity</h2>
        </div>
        <div className="divide-y divide-[#f1f3f5]">
          {logs.map((log, i) => (
            <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-[#f8f9fa] transition-colors">
              <div className="mt-0.5"><LogIcon status={log.status} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#111111]">{log.event}</p>
                <span className={`inline-block mt-0.5 text-xs px-1.5 py-0.5 rounded font-medium ${
                  log.type === "trade" ? "bg-[#e7f3ff] text-[#0066cc]" : "bg-[#f1f3f5] text-[#495057]"
                }`}>{log.type}</span>
              </div>
              <span className="text-xs font-mono text-[#495057] flex-shrink-0 mt-0.5">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ViewLayout>
  );
}