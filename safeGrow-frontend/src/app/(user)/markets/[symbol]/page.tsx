"use client";

import { useState, useEffect, useCallback, use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ViewLayout from "@/src/components/ViewLayout/ViewLayout";
import MarketSocketProvider from "@/src/features/market/MarketSocketProvider";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setSelectedSymbol } from "@/src/features/market/marketSlice";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
  Maximize2,
  BarChart3,
} from "lucide-react";

// Dynamically import chart
const CandleChart = dynamic(() => import("@/src/components/Markets/CandleChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-240px)] bg-[#0f1117] rounded-xl flex items-center justify-center border border-[#1e2130]">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-500 mx-auto mb-2" size={32} />
        <p className="text-xs text-gray-500">Loading Charting Engine...</p>
      </div>
    </div>
  ),
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const RESOLUTIONS = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "1D", value: "D" },
];

function formatPrice(n: number) {
  return n?.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "—";
}

export default function FullChartPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params);
  const symbol = decodeURIComponent(resolvedParams.symbol);

  const dispatch = useAppDispatch();
  const { ticks, status } = useAppSelector((s) => s.market);

  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [resolution, setResolution] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tick = ticks[symbol];
  const isUp = (tick?.changePercent ?? 0) >= 0;

  useEffect(() => {
    dispatch(setSelectedSymbol(symbol));
  }, [symbol, dispatch]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const toDate = new Date();
      const fromDate = new Date();

      if (resolution === "D") fromDate.setFullYear(fromDate.getFullYear() - 1);
      else if (resolution === "60") fromDate.setMonth(fromDate.getMonth() - 2);
      else fromDate.setDate(fromDate.getDate() - 7);

      const params = new URLSearchParams({
        symbol,
        resolution,
        from: fromDate.toISOString().split("T")[0],
        to: toDate.toISOString().split("T")[0],
      });

      const res = await fetch(`${API_BASE}/api/market/historical?${params}`);
      const json = await res.json();

      if (json.success) setHistoricalData(json.data);
      else setError("Failed to load historical data");
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }, [symbol, resolution]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <ViewLayout initialRole="user">
      <MarketSocketProvider />

      <div className="space-y-4">
        {/* Top Navigation & Status */}
        <div className="flex items-center justify-between">
          <Link
            href="/markets"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-white border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50">
              <ArrowLeft size={16} />
            </div>
            Back to Markets
          </Link>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${status === "online" ? "bg-green-50 text-green-700 border-green-200" :
              status === "connecting" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                "bg-red-50 text-red-600 border-red-200"
            }`}>
            {status === "online" ? <><Wifi size={13} className="animate-pulse" /> LIVE</> :
              status === "connecting" ? <><Loader2 size={13} className="animate-spin" /> CONNECTING</> :
                <><WifiOff size={13} /> OFFLINE</>}
          </div>
        </div>

        {/* Chart Container Card */}
        <div className="bg-[#0f1117] rounded-2xl border border-[#1e2130] shadow-2xl overflow-hidden">

          {/* Chart Header - Dark */}
          <div className="px-6 py-4 border-b border-[#1e2130] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">{symbol.split(':')[1] || symbol}</h1>
                <p className="text-[10px] text-gray-500 font-mono uppercase">{symbol}</p>
              </div>

              {tick && (
                <div className="flex items-baseline gap-4">
                  <div className="text-2xl font-bold text-white tabular-nums">
                    ₹{formatPrice(tick.ltp)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? "text-green-500" : "text-red-500"}`}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {tick.changePercent?.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[#1e2130] rounded-lg p-1 gap-1">
                {RESOLUTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setResolution(r.value)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${resolution === r.value
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchHistory}
                className="p-2 rounded-lg bg-[#1e2130] text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* OHLCV Bar - Dark */}
          {tick && (
            <div className="px-6 py-2 bg-[#161922] border-b border-[#1e2130] flex gap-8">
              {[
                { label: "OPEN", val: tick.open },
                { label: "HIGH", val: tick.high, color: "text-green-400" },
                { label: "LOW", val: tick.low, color: "text-red-400" },
                { label: "PREV CLOSE", val: tick.close },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[9px] font-black text-gray-600 tracking-widest">{item.label}</p>
                  <p className={`text-xs font-bold tabular-nums ${item.color || "text-gray-300"}`}>
                    {formatPrice(item.val)}
                  </p>
                </div>
              ))}
              <div>
                <p className="text-[9px] font-black text-gray-600 tracking-widest">VOLUME</p>
                <p className="text-xs font-bold tabular-nums text-gray-300">{tick.volume?.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* The Chart Area */}
          <div className="relative">
            {error ? (
              <div className="w-full h-[600px] flex flex-col items-center justify-center text-gray-500">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">{error}</p>
                <button onClick={fetchHistory} className="mt-4 text-blue-500 text-xs font-bold hover:underline">RETRY FETCH</button>
              </div>
            ) : (
              <CandleChart
                historicalData={historicalData}
                liveTick={tick}
                height={600}
              />
            )}
          </div>
        </div>

        {/* Bottom Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 tracking-widest mb-2 uppercase">Symbol Info</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Exchange</span>
                <span className="font-bold text-gray-800">NSE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Segment</span>
                <span className="font-bold text-gray-800">EQUITY</span>
              </div>
            </div>
          </div>
          {/* More cards can go here */}
        </div>
      </div>
    </ViewLayout>
  );
}
