import cron from "node-cron";
import getBroker from "../brokers/index.js";
import SystemBroker from "../models/SystemBroker.js";
import { loginXTS, getXTSToken, getXTSUserID } from "../brokers/fivepaisa/xts.auth.js";
import { getActiveSystemBroker, setActiveSystemBroker, getNextFallbackBroker } from "./systemState.js";

let failureCount = 0;

/**
 * Login with backend keys, save token to DB, and start the WebSocket feed.
 */
export const refreshMarketDataToken = async () => {
    const brokerName = getActiveSystemBroker();
    console.log(`[MarketData] 🔄 Attempting refresh for: ${brokerName.toUpperCase()}`);

    try {
        let token = "";
        let userID = "";

        if (brokerName === "fivepaisa") {
            await loginXTS();
            token = getXTSToken();
            userID = getXTSUserID();
        } else if (brokerName === "fyers") {
            const { automateFyersLogin } = await import("../brokers/fyers/fyers.automate.js");
            const { getAccessToken } = await import("../brokers/fyers/fyers.auth.js");

            const authCode = await automateFyersLogin();
            const response = await getAccessToken(authCode);

            token = response.access_token;

            const jwtPayload = JSON.parse(
                Buffer.from(token.split(".")[1], "base64").toString("utf-8")
            );
            userID = jwtPayload.fy_id;
        }

        if (!token) throw new Error("Empty token received");

        // Update DB
        await SystemBroker.findOneAndUpdate(
            { broker: brokerName },
            {
                broker: brokerName,
                accessToken: token,
                userID,
                tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            { upsert: true }
        );

        failureCount = 0; // Reset on success
        const broker = getBroker();
        await broker.startLive();
        console.log(`[MarketData] ✅ ${brokerName.toUpperCase()} is LIVE.`);

    } catch (err: any) {
        failureCount++;
        console.error(`[MarketData] ❌ ${brokerName.toUpperCase()} failed (Attempt ${failureCount}/3):`, err.message);

        if (failureCount >= 3) {
            const fallback = getNextFallbackBroker(brokerName);
            console.error(`[MarketData] 🚨 CRITICAL: ${brokerName.toUpperCase()} is down. Switching to ${fallback.toUpperCase()}...`);
            
            setActiveSystemBroker(fallback);
            failureCount = 0;
            await refreshMarketDataToken(); // Recursive retry with fallback
        }
    }
};

/**
 * Initialization on Server Boot
 */
export const initMarketData = async () => {
    const brokerName = getActiveSystemBroker();
    console.log(`[MarketData] 🛠️ Initializing Master Feed: ${brokerName.toUpperCase()}`);

    const existing = await SystemBroker.findOne({ broker: brokerName });
    const isValid = existing && existing.tokenExpiry && existing.tokenExpiry > new Date();

    if (isValid) {
        console.log(`[MarketData] 📦 Using existing token for ${brokerName}.`);
        if (brokerName === "fivepaisa") {
            const { setXTSToken, setXTSUserID } = await import("../brokers/fivepaisa/xts.auth.js");
            setXTSToken(existing.accessToken);
            setXTSUserID(existing.userID);
        }
        try {
            await getBroker().startLive();
        } catch (err) {
            await refreshMarketDataToken();
        }
    } else {
        await refreshMarketDataToken();
    }

    // Cron at 8:55 AM
    cron.schedule("55 8 * * *", async () => {
        console.log(`[MarketData] ⏰ Cron refresh triggered.`);
        await refreshMarketDataToken();
    }, { timezone: "Asia/Kolkata" });
};
