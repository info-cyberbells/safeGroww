"use client";

import Link from "next/link";
import { useState } from "react";
import ViewLayout from "../../../components/ViewLayout/ViewLayout";
import MarketSocketProvider from "../../../features/market/MarketSocketProvider";
import { useAppSelector } from "../../../store/hooks";
import { TrendingUp, TrendingDown, Search, Wifi, WifiOff, Loader2, BarChart3 } from "lucide-react";

// ── Instrument Catalogue ──────────────────────────────────────────────────────
const CATEGORIES = ["All", "Indices", "Banking", "IT", "Auto", "Energy", "Pharma"] as const;
type Category = (typeof CATEGORIES)[number];

interface Instrument {
  symbol: string;
  name: string;
  short: string;
  category: Exclude<Category, "All">;
  exchange: string;
}

const INSTRUMENTS: Instrument[] = [
  // Indices
  { symbol: "NSE:NIFTY50-INDEX", name: "Nifty 50", short: "NIFTY 50", category: "Indices", exchange: "NSE" },
  { symbol: "NSE:NIFTYBANK-INDEX", name: "Bank Nifty", short: "BANKNIFTY", category: "Indices", exchange: "NSE" },
  // Banking
  { symbol: "NSE:SBIN-EQ", name: "State Bank of India", short: "SBIN", category: "Banking", exchange: "NSE" },
  { symbol: "NSE:HDFCBANK-EQ", name: "HDFC Bank", short: "HDFCBANK", category: "Banking", exchange: "NSE" },
  { symbol: "NSE:ICICIBANK-EQ", name: "ICICI Bank", short: "ICICIBANK", category: "Banking", exchange: "NSE" },
  { symbol: "NSE:AXISBANK-EQ", name: "Axis Bank", short: "AXISBANK", category: "Banking", exchange: "NSE" },
  { symbol: "NSE:BAJFINANCE-EQ", name: "Bajaj Finance", short: "BAJFINANCE", category: "Banking", exchange: "NSE" },
  { symbol: "NSE:KOTAKBANK-EQ", name: "Kotak Mahindra Bank", short: "KOTAKBANK", category: "Banking", exchange: "NSE" },
  // IT
  { symbol: "NSE:TCS-EQ", name: "Tata Consultancy Svcs", short: "TCS", category: "IT", exchange: "NSE" },
  { symbol: "NSE:INFY-EQ", name: "Infosys", short: "INFY", category: "IT", exchange: "NSE" },
  { symbol: "NSE:WIPRO-EQ", name: "Wipro", short: "WIPRO", category: "IT", exchange: "NSE" },
  { symbol: "NSE:HCLTECH-EQ", name: "HCL Technologies", short: "HCLTECH", category: "IT", exchange: "NSE" },
  // Auto
  { symbol: "NSE:MARUTI-EQ", name: "Maruti Suzuki", short: "MARUTI", category: "Auto", exchange: "NSE" },
  { symbol: "NSE:TMPV-EQ", name: "Tata Motors (PV)", short: "TMPV", category: "Auto", exchange: "NSE" },
  { symbol: "NSE:M&M-EQ", name: "Mahindra & Mahindra", short: "M&M", category: "Auto", exchange: "NSE" },
  { symbol: "NSE:BAJAJ-AUTO-EQ", name: "Bajaj Auto", short: "BAJAJ-AUTO", category: "Auto", exchange: "NSE" },
  // Energy
  { symbol: "NSE:RELIANCE-EQ", name: "Reliance Industries", short: "RELIANCE", category: "Energy", exchange: "NSE" },
  { symbol: "NSE:ONGC-EQ", name: "ONGC", short: "ONGC", category: "Energy", exchange: "NSE" },
  { symbol: "NSE:NTPC-EQ", name: "NTPC", short: "NTPC", category: "Energy", exchange: "NSE" },
  { symbol: "NSE:POWERGRID-EQ", name: "Power Grid Corp", short: "POWERGRID", category: "Energy", exchange: "NSE" },
  // Pharma
  { symbol: "NSE:SUNPHARMA-EQ", name: "Sun Pharmaceutical", short: "SUNPHARMA", category: "Pharma", exchange: "NSE" },
  { symbol: "NSE:DRREDDY-EQ", name: "Dr. Reddy's Labs", short: "DRREDDY", category: "Pharma", exchange: "NSE" },
  { symbol: "NSE:CIPLA-EQ", name: "Cipla", short: "CIPLA", category: "Pharma", exchange: "NSE" },
];

// Key indices shown at the top hero section
const HERO_INDICES = [
  { symbol: "NSE:NIFTY50-INDEX", label: "Nifty 50" },
  { symbol: "NSE:NIFTYBANK-INDEX", label: "Bank Nifty" },
  { symbol: "NSE:SBIN-EQ", label: "SBIN" },
];

function formatPrice(n: number) {
  if (!n) return "—";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatPct(n?: number) {
  if (n == null) return null;
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

// ── Key Indices Hero Row ────────────────────────────────────────────────────────
function IndexTracker({ symbol, label }: { symbol: string; label: string }) {
  const tick = useAppSelector((s) => s.market.ticks[symbol]);
  const up = (tick?.changePercent ?? 0) >= 0;

  return (
    <Link
      href={`/markets/${encodeURIComponent(symbol)}`}
      className="flex-shrink-0 flex items-center gap-3 bg-white border border-[#ced4da] rounded-2xl px-4 py-3 min-w-[200px] hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
        {label.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 tabular-nums">
            {tick ? formatPrice(tick.ltp) : "—"}
          </span>
          {tick && (
            <span className={`text-[10px] font-bold ${up ? "text-green-600" : "text-red-500"}`}>
              {formatPct(tick.changePercent)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Instrument Row Card ───────────────────────────────────────────────────────
function InstrumentCard({ instrument }: { instrument: Instrument }) {
  const tick = useAppSelector((s) => s.market.ticks[instrument.symbol]);
  const up = (tick?.changePercent ?? 0) >= 0;
  const hasLive = !!tick;

  return (
    <Link
      href={`/markets/${encodeURIComponent(instrument.symbol)}`}
      className="flex items-center justify-between px-4 py-3 bg-white border border-[#ced4da] rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          <BarChart3 size={18} className="text-gray-400 group-hover:text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{instrument.short}</p>
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{instrument.name}</p>
        </div>
      </div>

      <div className="text-right">
        {hasLive ? (
          <>
            <p className="text-sm font-bold text-gray-900 tabular-nums">₹{formatPrice(tick.ltp)}</p>
            <p className={`text-[10px] font-bold tabular-nums ${up ? "text-green-600" : "text-red-500"}`}>
              {formatPct(tick.changePercent)}
            </p>
          </>
        ) : (
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">NO LIVE DATA</p>
        )}
      </div>
    </Link>
  );
}


// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketsPage() {
  const { status } = useAppSelector((s) => s.market);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = INSTRUMENTS.filter((i) => {
    const matchCat = activeCategory === "All" || i.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || i.short.toLowerCase().includes(q) || i.name.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <ViewLayout initialRole="user">
      <MarketSocketProvider />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Market Overview</h1>
            <p className="text-sm text-gray-500 font-medium">Real-time quotes across NSE/BSE segments</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border shadow-sm ${status === "online" ? "bg-green-50 text-green-700 border-green-200" :
              status === "connecting" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                "bg-red-50 text-red-600 border-red-200"
            }`}>
            {status === "online" ? <><Wifi size={14} className="animate-pulse" /> LIVE</> :
              status === "connecting" ? <><Loader2 size={14} className="animate-spin" /> CONNECTING</> :
                <><WifiOff size={14} /> OFFLINE</>}
          </div>
        </div>

        {/* Index Horizontal Scroll */}
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-4">
            {HERO_INDICES.map((idx) => (
              <IndexTracker key={idx.symbol} {...idx} />
            ))}
          </div>
        </div>

        {/* Browser Section */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800">Instrument Browser</h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="instrument-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Stocks..."
                  className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Instrument Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search size={48} className="mb-4 opacity-10" />
              <p className="text-sm font-medium">No instruments match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((inst) => (
                <InstrumentCard key={inst.symbol} instrument={inst} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ViewLayout>
  );
}