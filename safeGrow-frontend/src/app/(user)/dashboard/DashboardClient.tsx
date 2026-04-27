"use client"

import { useState } from "react";
import {
  TrendingUp, Wallet, Activity, X, 
  CheckCircle, AlertCircle, Clock, Loader2
} from "lucide-react";
import ViewLayout from "../../../components/ViewLayout/ViewLayout";
import { useGetDashboardDataQuery } from "@/src/features/dashboard/dashboardApi";

type LogStatus = "success" | "error" | "warning" | "info";

function LogIcon({ status }: { status: LogStatus }) {
  if (status === "success") return <CheckCircle size={15} className="text-green-600 flex-shrink-0" />;
  if (status === "error") return <AlertCircle size={15} className="text-red-500 flex-shrink-0" />;
  if (status === "warning") return <AlertCircle size={15} className="text-yellow-500 flex-shrink-0" />;
  return <Clock size={15} className="text-blue-500 flex-shrink-0" />;
}

export default function Dashboard() {
  // 1. ALL HOOKS AT THE TOP
  const { data: apiResponse, isLoading, error } = useGetDashboardDataQuery();

  // 2. Loading State
  if (isLoading) {
    return (
      <ViewLayout initialRole="user">
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#7c7e8c]">
          <Loader2 className="w-10 h-10 animate-spin text-[#0066cc]" />
          <p className="text-sm font-medium animate-pulse">Syncing with Broker...</p>
        </div>
      </ViewLayout>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <ViewLayout initialRole="user">
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-red-500">
          <AlertCircle className="w-10 h-10" />
          <p className="text-sm font-medium">Failed to fetch dashboard data. Please try logging in again.</p>
        </div>
      </ViewLayout>
    );
  }

  const realData = apiResponse?.data;
  const funds = realData?.funds || { balance: 0, available: 0 };
  const holdings = realData?.holdings || [];
  const positions = realData?.positions || [];
  const orders = realData?.orders || [];

  return (
    <ViewLayout initialRole="user">
      <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen text-[#7c7e8c] p-4 lg:p-8">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Dashboard</h1>
            {realData?.broker && (
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                {realData.broker}
              </span>
            )}
          </div>
          <p className="text-sm text-[#495057] mt-0.5">Welcome back, {realData?.profile?.name || "Trader"}</p>
        </div>

        {/* 1. Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Balance", value: `₹${funds.balance?.toLocaleString() || "0"}`, sub: "Full account value", icon: <Wallet size={18} />, color: "blue" },
            { label: "Available Margin", value: `₹${funds.available?.toLocaleString() || "0"}`, sub: "Ready for trade", icon: <Activity size={18} />, color: "gray" },
            { label: "Active Positions", value: positions.length.toString(), sub: "In-market trades", icon: <TrendingUp size={18} />, color: "green" },
            { label: "Recent Orders", value: orders.length.toString(), sub: "Last 24 hours", icon: <Clock size={18} />, color: "blue" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#e9ecef] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#adb5bd]">{card.label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : card.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111111] font-mono">
                {card.value}
              </div>
              <div className="text-xs text-[#495057] mt-1 opacity-70 font-medium">{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 2. Open Positions Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#e9ecef] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#e9ecef] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" /> Open Positions
              </h2>
              <span className="text-[10px] font-bold bg-[#f8f9fa] px-2 py-0.5 rounded text-[#495057]">LIVE</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8f9fa] text-[10px] text-[#adb5bd] font-bold uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Asset</th>
                    <th className="px-6 py-3 text-left">Entry</th>
                    <th className="px-6 py-3 text-left">LTP</th>
                    <th className="px-6 py-3 text-left">Qty</th>
                    <th className="px-6 py-3 text-left">PnL</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f5]">
                  {positions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#adb5bd] font-medium italic">
                        No open positions in your account.
                      </td>
                    </tr>
                  ) : (
                    positions.map((pos: any, i: number) => {
                      const pnl = pos.pl || pos.pnl || 0;
                      const up = pnl >= 0;
                      const symbol = pos.symbol || pos.TradingSymbol || "Unknown";
                      return (
                        <tr key={i} className="hover:bg-[#f8f9fa] transition-colors group">
                          <td className="px-6 py-4 font-bold text-[#111111]">{symbol}</td>
                          <td className="px-6 py-4 font-mono text-[#495057]">{(pos.avgPrice || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 font-mono text-[#111111] font-semibold">{(pos.lp || pos.LastPrice || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 font-mono text-[#495057]">{pos.netQty || 0}</td>
                          <td className={`px-6 py-4 font-mono font-bold ${up ? "text-green-600" : "text-red-500"}`}>
                            {up ? "+" : ""}₹{pnl.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100">
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Recent Activity / Logs */}
          <div className="xl:col-span-1 bg-white rounded-2xl border border-[#e9ecef] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#e9ecef]">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <Clock size={16} className="text-blue-600" /> Recent Orders
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#f1f3f5] max-h-[600px]">
              {orders.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-[#adb5bd] font-medium italic">
                  No recent orders found.
                </div>
              ) : (
                orders.slice(0, 15).map((order: any, i: number) => {
                  const symbol = order.symbol || order.TradingSymbol || "Unknown";
                  const type = order.side === 1 ? "BUY" : "SELL";
                  const status = order.status === 2 ? "success" : order.status === 5 ? "error" : "info";
                  const time = order.orderDateTime || order.OrderEntryTime || "Now";

                  return (
                    <div key={i} className="px-6 py-4 flex items-start gap-4 hover:bg-[#f8f9fa] transition-colors">
                      <div className="mt-1"><LogIcon status={status as any} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#111111] truncate">{symbol}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${type === 'BUY' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                            {type}
                          </span>
                          <span className="text-[11px] font-mono text-[#495057]">
                            Qty: {order.qty || order.quantity} @ {(order.avgPrice || order.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#adb5bd] flex-shrink-0 mt-1">
                        {time.toString().split(' ').pop()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}