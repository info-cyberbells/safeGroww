// @ts-ignore
import { WS as XtsMarketDataWS } from "xts-marketdata-api";
import xtsMarketData from "./xts.instance.js"; 
import { getXTSToken, getXTSUserID } from "./xts.auth.js";
import SystemBroker from "../../models/SystemBroker.js";
import { marketStore } from "../../services/marketStore.service.js";

const BASE_URL = process.env.XTS_BASE_URL
    || "https://xtsmum.5paisa.com/apibinarymarketdata";

let xtsWS: any = null;

// ✅ subscription is a REST call, not a WS call
const subscribeToSymbols = async () => {
    try {
        const response = await xtsMarketData.subscription({
            instruments: [
                { exchangeSegment: 1, exchangeInstrumentID: 22 },  // NIFTY
                { exchangeSegment: 1, exchangeInstrumentID: 26 },  // BANKNIFTY
            ],
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

    // 🚨 FIX: The SDK REST client (MDRestAPI) requires a full login call 
    // to initialize its internal headers. If memory is empty, do a fresh login.
    if (!token) {
        console.log("[XTS WS] No live session in memory. Logging in to initialize REST client...");
        const { loginXTS } = await import("./xts.auth.js");
        const session = await loginXTS();
        token = session.token;
        userID = session.userID;
    }

    if (!token) {
        console.error("XTS token not found even after login attempt");
        return;
    }

    xtsWS = new XtsMarketDataWS(BASE_URL);

    xtsWS.onConnect(() => {
        console.log("XTS WebSocket connected ✅");
        marketStore.setStatus("online");
    });

    xtsWS.onJoined(async (data: any) => {
        console.log("XTS joined:", data);

        try {
            console.log("[XTS] Attempting subscription...");
            await subscribeToSymbols();
        } catch (err) {
            console.error("Subscription failed:", err);
        }
    });

    xtsWS.onXTSBinaryPacketEvent((data: any) => {
        // Safe check for Touchline data
        if (data && data.Touchline) {
            const key = `${data.ExchangeSegment}:${data.ExchangeInstrumentID}`;
            const touchline = data.Touchline;

            // XTS prices are sometimes returned as 0 if packet is just a heartbeat
            if (touchline.LastTradedPrice > 0) {
                marketStore.update(key, {
                    symbol: key,
                    ltp: touchline.LastTradedPrice,
                    open: touchline.Open,
                    high: touchline.High,
                    low: touchline.Low,
                    close: touchline.Close,
                    volume: touchline.TotalTradedQuantity,
                    change: touchline.PercentChange,
                    timestamp: data.ExchangeTimeStamp,
                });
                // Reduced logging to avoid console clutter
            }
        }
    });


    xtsWS.onError((err: any) => {
        console.error("XTS WS error:", err);
        marketStore.setStatus("offline");
    });

    xtsWS.onDisconnect((reason: any) => {
        console.log("XTS WS disconnected:", reason);
    });

    xtsWS.init({
        userID,
        publishFormat: "JSON",
        broadcastMode: "Full",
        token,
    });
};

export const getXTSLatestTick = () => marketStore.getAllTicks();