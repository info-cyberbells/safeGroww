import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Shape of a normalized tick (after field name mapping)
export interface TickData {
  symbol: string;
  ltp: number;          // Last Traded Price
  open: number;         // Day open
  high: number;         // Day high
  low: number;          // Day low
  close: number;        // Previous day close (used for change%)
  volume: number;
  change?: number;
  changePercent?: number;
  lastUpdated?: string;
}

interface MarketState {
  ticks: Record<string, TickData>;
  status: "online" | "offline" | "connecting";
  selectedSymbol: string;
  watchlist: string[];
}

const initialState: MarketState = {
  ticks: {},
  status: "connecting",
  selectedSymbol: "NSE:SBIN-EQ",
  watchlist: [
    "NSE:NIFTY50-INDEX",
    "NSE:SBIN-EQ",
  ],
};

/**
 * Fyers WebSocket sends non-standard field names.
 * This function normalizes raw broker tick data into our standard TickData shape.
 *
 * Fyers Full Mode fields:
 *   ltp / lp           → Last Traded Price
 *   open_price / op    → Day Open
 *   high_price / h     → Day High
 *   low_price  / l     → Day Low
 *   prev_close_price / pc → Previous Day Close
 *   vol_traded_today / v  → Volume
 *   change / chng         → Absolute Change
 *   change_percentage / chp → Change %
 */
function normalize(raw: any): TickData {
  const ltp = raw.ltp ?? raw.lp ?? 0;
  const open = raw.open_price ?? raw.op ?? raw.open ?? 0;
  const high = raw.high_price ?? raw.h ?? raw.high ?? 0;
  const low = raw.low_price ?? raw.l ?? raw.low ?? 0;
  const prevClose = raw.prev_close_price ?? raw.pc ?? raw.close ?? 0;
  const volume = raw.vol_traded_today ?? raw.v ?? raw.volume ?? 0;

  // Prefer broker-supplied change, fallback to computing it
  const change = raw.change ?? raw.chng ?? (prevClose > 0 ? ltp - prevClose : 0);
  const changePercent =
    raw.change_percentage ?? raw.chp ?? (prevClose > 0 ? (change / prevClose) * 100 : 0);

  return {
    symbol: raw.symbol ?? "",
    ltp,
    open,
    high,
    low,
    close: prevClose,
    volume,
    change,
    changePercent,
    lastUpdated: raw.lastUpdated,
  };
}

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    tickReceived(state, action: PayloadAction<any>) {
      const tick = normalize(action.payload);
      if (tick.symbol) {
        state.ticks[tick.symbol] = tick;
      }
    },

    allTicksReceived(state, action: PayloadAction<Record<string, any>>) {
      Object.entries(action.payload).forEach(([symbol, raw]) => {
        const tick = normalize({ ...raw, symbol });
        if (tick.symbol) {
          state.ticks[tick.symbol] = tick;
        }
      });
    },

    setMarketStatus(state, action: PayloadAction<"online" | "offline" | "connecting">) {
      state.status = action.payload;
    },

    setSelectedSymbol(state, action: PayloadAction<string>) {
      state.selectedSymbol = action.payload;
    },
  },
});

export const {
  tickReceived,
  allTicksReceived,
  setMarketStatus,
  setSelectedSymbol,
} = marketSlice.actions;

export default marketSlice.reducer;
