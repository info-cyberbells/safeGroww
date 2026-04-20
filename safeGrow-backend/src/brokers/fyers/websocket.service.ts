import { fyersDataSocket } from "fyers-api-v3";
import User from "../../models/User.js";
import SystemBroker from "../../models/SystemBroker.js";

import { marketStore } from "../../services/marketStore.service.js";

export const startFyersWebSocket = async () => {
    // 1. Try to get token from SystemBroker (Primary feed)
    let tokenData = await SystemBroker.findOne({ broker: "fyers" });
    let accessToken = tokenData?.accessToken;

    // 2. Fallback to latest User login if System token not found
    if (!accessToken) {
        const user = await User.findOne({ broker: "fyers" }).sort({ _id: -1 });
        accessToken = user?.accessToken;
    }

    if (!accessToken) {
        console.error("No Fyers access token found in SystemBroker or User, cannot start WebSocket");
        return;
    }

    // Correct API: getInstance(accessToken)
    const skt = fyersDataSocket.getInstance(accessToken);

    skt.on("connect", () => {
        console.log("Fyers WebSocket connected");
        marketStore.setStatus("online");
        skt.subscribe(["NSE:SBIN-EQ", "NSE:NIFTY50-INDEX"], false, 1);
        skt.mode(skt.FullMode, 1); // full mode = all tick fields
    });

    skt.on("message", (msg: any) => {
        if (msg?.symbol) {
            marketStore.update(msg.symbol, msg);
        }
    });

    skt.on("error", (err: any) => {
        console.error("Fyers WS error:", err);
        marketStore.setStatus("offline");
    });

    skt.on("close", () => {
        console.log("Fyers WebSocket closed");
        marketStore.setStatus("offline");
    });

    skt.connect();
    skt.autoreconnect(); // auto-reconnects on drop
};

export const getLatestTick = () => marketStore.getAllTicks();