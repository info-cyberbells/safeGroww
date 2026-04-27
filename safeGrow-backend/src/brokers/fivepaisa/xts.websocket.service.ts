// @ts-ignore
import { WS as XtsMarketDataWS } from "xts-marketdata-api";
import xtsMarketData from "./xts.instance.js";
import { getXTSToken, getXTSUserID } from "./xts.auth.js";
import SystemBroker from "../../models/SystemBroker.js";
import { marketStore } from "../../services/marketStore.service.js";
import { XTS_SYMBOL_MAP } from "./xts.mapping.js";

const BASE_URL = process.env.XTS_BASE_URL
    || "https://xtsmum.5paisa.com/apibinarymarketdata";

let xtsWS: any = null;

// ✅ subscription is a REST call, not a WS call
const subscribeToSymbols = async () => {
    try {
        const instruments = Object.keys(XTS_SYMBOL_MAP).map(key => {
            const [seg, id] = key.split(":");
            return { exchangeSegment: parseInt(seg), exchangeInstrumentID: parseInt(id) };
        });

        const response = await xtsMarketData.subscription({
            instruments,
            xtsMessageCode: 1501,  // 1501 = touchline (LTP, OHLC, volume)
        });
        console.log("XTS subscription response:", response);
    } catch (err) {
        console.error("XTS subscription error:", err);
    }
};

export const startXTSWebSocket = async () => {
    let token = getXTSToken();
    let userID = getXTSUserID();

    if (!token || !userID) {
        console.error("[XTS] Cannot start WebSocket: No token or UserID");
        return;
    }

    // ✅ Sync the REST client with the current session
    xtsMarketData.token = token;
    xtsMarketData.userID = userID;
    xtsMarketData.isLoggedIn = true;

    xtsWS = new XtsMarketDataWS(BASE_URL);

    xtsWS.onConnect((res: any) => {
        console.log("XTS WebSocket connected ✅");
        marketStore.setStatus("online");
    });

    xtsWS.onJoined(async (res: any) => {
        console.log("XTS WebSocket joined successfully!");
        marketStore.setStatus("online");
        try {
            console.log("[XTS] Attempting subscription...");
            await subscribeToSymbols();
        } catch (err) {
            console.error("Subscription failed:", err);
        }
    });

    xtsWS.onXTSBinaryPacketEvent((data: any) => {
        if (data && data.Touchline) {
            const xtsKey = `${data.ExchangeSegment}:${data.ExchangeInstrumentID}`;
            const symbol = XTS_SYMBOL_MAP[xtsKey] || xtsKey;
            const t = data.Touchline;

            const cleanPrice = (val: any) => (val && val > 0.0001) ? val : 0;

            // Simple Mode Detection
            // If LastTradedPrice is 0 or garbage, use Close as LTP (Summary mode)
            const isLive = t.LastTradedPrice && t.LastTradedPrice > 1;
            
            let ltp = isLive ? t.LastTradedPrice : cleanPrice(t.Close);
            let chp = t.PercentChange || 0;

            if (ltp > 0) {
                marketStore.update(symbol, {
                    symbol,
                    ltp,
                    open: cleanPrice(t.Open) || ltp,
                    high: cleanPrice(t.High) || ltp,
                    low: cleanPrice(t.Low) || ltp,
                    close: cleanPrice(t.Close) || ltp,
                    volume: cleanPrice(t.TotalTradedQuantity),
                    chp: chp, // Percent change
                    change: 0,
                    timestamp: data.ExchangeTimeStamp,
                });
            }
        }
    });

    xtsWS.onError((err: any) => {
        console.error("XTS WebSocket Error:", err);
        marketStore.setStatus("offline");
    });

    xtsWS.onDisconnect((res: any) => {
        console.log("XTS WebSocket disconnected ❌");
        marketStore.setStatus("offline");
    });

    // Start connection
    xtsWS.init({
        userID: userID,
        token: token,
        publishFormat: "JSON",
        broadcastMode: "Full"
    });
};

export const getXTSLatestTick = (symbol?: string) => {
    if (symbol) return marketStore.getTick(symbol);
    return marketStore.getAllTicks();
};

export const stopXTSWebSocket = () => {
    if (xtsWS) {
        xtsWS.logOut();
        xtsWS = null;
    }
};