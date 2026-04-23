import { fyersDataSocket } from "fyers-api-v3";
import User from "../../models/User.js";
import SystemBroker from "../../models/SystemBroker.js";
import { marketStore } from "../../services/marketStore.service.js";
import { INSTRUMENT_CATALOGUE } from "../../config/instruments.js";

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

    const skt = fyersDataSocket.getInstance(accessToken);

    skt.on("connect", () => {
        console.log("Fyers WebSocket connected ✅");
        marketStore.setStatus("online");
        
        // Use the central Master Catalogue
        const symbols = INSTRUMENT_CATALOGUE.map(item => item.symbol);
        
        console.log(`[Fyers WS] Subscribing to ${symbols.length} symbols...`);
        skt.subscribe(symbols, false, 1);
        skt.mode(skt.FullMode, 1);
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
    skt.autoreconnect();
};

export const getLatestTick = () => marketStore.getAllTicks();