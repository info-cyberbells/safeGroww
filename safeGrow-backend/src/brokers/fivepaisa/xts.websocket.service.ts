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
                { exchangeSegment: 1, exchangeInstrumentID: 3045 }, // SBIN (Stock)
                { exchangeSegment: 1, exchangeInstrumentID: 22 },   // NIFTY (Index)
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

    // 🚨 SDK PRIMING: 
    // The MDRestAPI object (xtsMarketData) MUST be initialized 
    // via a login call at least once per server session.
    if (!(xtsMarketData as any).token) {
        console.log("[XTS WS] Initializing REST client session...");
        const { loginXTS } = await import("./xts.auth.js");
        const session = await loginXTS();
        token = session.token;
        userID = session.userID;

        // 💾 PERSIST TO DB: Update the token in DB
        await SystemBroker.findOneAndUpdate(
            { broker: "fivepaisa" },
            {
                accessToken: token,
                userID: userID,
                tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
                updatedAt: new Date()
            },
            { upsert: true }
        );
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
            if (touchline.LastTradedPrice !== undefined) {
                const clean = (val: any) => (val && val > 0.0001) ? val : 0;

                const rawLtp = clean(touchline.LastTradedPrice) || clean(touchline.Close);
                const ltp = (rawLtp > 1) ? rawLtp : (clean(touchline.Close) || 0);

                // Sanity Check: If High/Low is noise (too far from LTP), use LTP
                const high = clean(touchline.High);
                const low = clean(touchline.Low);

                marketStore.update(key, {
                    symbol: key,
                    ltp: ltp,
                    open: clean(touchline.Open) || ltp,
                    high: (high > ltp * 0.5 && high < ltp * 1.5) ? high : ltp,
                    low: (low > ltp * 0.5 && low < ltp * 1.5) ? low : ltp,
                    close: clean(touchline.Close) || ltp,
                    volume: clean(touchline.TotalTradedQuantity),
                    change: clean(touchline.PercentChange),
                    timestamp: data.ExchangeTimeStamp,
                });
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