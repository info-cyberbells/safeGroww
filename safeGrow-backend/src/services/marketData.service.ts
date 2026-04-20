/**
 * marketData.service.ts
 *
 * Manages the SERVER's own market data broker connection.
 *
 * Responsibilities:
 *  - Login with backend API keys (from .env) on server start
 *  - Store the access token in DB (SystemBroker collection)
 *  - Refresh token daily via cron (before market opens at 9:00 AM)
 *  - Start/restart the WebSocket market data feed after each token refresh
 *
 * USER TOKENS ARE NOT INVOLVED HERE.
 * Users login separately — their tokens are stored in the User collection
 * and are used only for order execution (future feature).
 */

import cron from "node-cron";
import getBroker from "../brokers/index.js";
import SystemBroker from "../models/SystemBroker.js";
import { loginXTS, getXTSToken, getXTSUserID } from "../brokers/fivepaisa/xts.auth.js";

const BROKER_NAME = process.env.BROKER || "fivepaisa";

/**
 * Login with backend keys, save token to DB, and start the WebSocket feed.
 * Called on server boot and by the daily cron job.
 */
export const refreshMarketDataToken = async () => {
    console.log(`[MarketData] Refreshing token for broker: ${BROKER_NAME}`);

    if (BROKER_NAME !== "fivepaisa") {
        console.warn(`[MarketData] Auto-login not supported for ${BROKER_NAME}. Please login manually via UI.`);
        return;
    }

    try {
        // Login with server's own API keys (from .env)
        await loginXTS();

        const token = getXTSToken();
        const userID = getXTSUserID();

        if (!token) {
            throw new Error("[MarketData] Token is empty after login");
        }

        // Save/update token in DB under SystemBroker collection
        await SystemBroker.findOneAndUpdate(
            { broker: BROKER_NAME },
            {
                broker: BROKER_NAME,
                accessToken: token,
                userID,
                tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            { upsert: true, returnDocument: "after" }
        );

        console.log(`[MarketData] Token saved to DB. UserID: ${userID}`);

        // Start the live WebSocket feed with the new token
        const broker = getBroker();
        await broker.startLive();

        console.log("[MarketData] WebSocket market feed started ✅");
    } catch (err) {
        console.error("[MarketData] Failed to refresh token:", err);
    }
};

/**
 * On server boot:
 *  1. Try to load existing valid token from DB
 *  2. If token still valid → just start WebSocket (no re-login needed)
 *  3. If token expired/missing → full login + save to DB + start WebSocket
 */
export const initMarketData = async () => {
    console.log("[MarketData] Initializing market data service...");

    const existing = await SystemBroker.findOne({ broker: BROKER_NAME });

    const isValid =
        existing &&
        existing.tokenExpiry &&
        existing.tokenExpiry > new Date();

    if (isValid) {
        console.log("[MarketData] Valid token found in DB. Starting WebSocket...");
        try {
            const broker = getBroker();
            await broker.startLive();
            console.log("[MarketData] WebSocket started with existing token ✅");
        } catch (err) {
            console.warn("[MarketData] WebSocket start failed, doing fresh login...");
            await refreshMarketDataToken();
        }
    } else {
        console.log("[MarketData] No valid token in DB. Doing fresh login...");
        await refreshMarketDataToken();
    }

    // Schedule daily token refresh at 8:55 AM (before market opens at 9:15 AM)
    cron.schedule("55 8 * * *", async () => {
        console.log("[MarketData] Cron triggered — refreshing market data token...");
        await refreshMarketDataToken();
    }, {
        timezone: "Asia/Kolkata"
    });

    console.log("[MarketData] Cron scheduled: daily at 8:55 AM IST ✅");
};
