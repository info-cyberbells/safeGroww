import { Request, Response } from "express";
import SystemBroker from "../models/SystemBroker.js";
import getBroker from "../brokers/index.js";
import asyncHandler from "../utils/asyncHandler.js";

import { getActiveSystemBroker } from "../services/systemState.js";

// Fetches the Admin/System token for the master market data broker
const getSystemToken = async () => {
    const brokerName = getActiveSystemBroker();
    const sys = await SystemBroker.findOne({ broker: brokerName });
    return sys?.accessToken;
};

/**
 * Intelligent Wrapper:
 * 1. Tries the request with existing token.
 * 2. If it fails due to auth/expiry, triggers refreshMarketDataToken().
 * 3. Retries the request once more.
 */
const withSystemRetry = async (res: Response, fn: (token: string) => Promise<any>) => {
    let token = await getSystemToken();
    try {
        const data = await fn(token || "");
        
        // Detect Token Expiry (Fyers code -16 or XTS code 1001 or 401 status)
        const isFyersAuthError = data && data.s === "error" && (data.code === -16 || data.message?.toLowerCase().includes("authenticate"));
        const isXTSAuthError = data && (data.code === "1001" || data.status === 401 || data.message?.toLowerCase().includes("session expired"));

        if (isFyersAuthError || isXTSAuthError) {
            throw new Error("TOKEN_EXPIRED");
        }
        
        return res.json(data);
    } catch (err: any) {
        if (err.message === "TOKEN_EXPIRED" || !token) {
            console.log("[Market Controller] 🔄 Master token expired or missing. Auto-refreshing...");
            const { refreshMarketDataToken } = await import("../services/marketData.service.js");
            await refreshMarketDataToken();
            
            const newToken = await getSystemToken();
            if (!newToken) throw new Error("Failed to refresh master token");
            
            const retryData = await fn(newToken);
            return res.json(retryData);
        }
        throw err;
    }
};

// GET /api/market/quotes?symbols=NSE:SBIN-EQ,NSE:TCS-EQ
export const getQuotes = asyncHandler(async (req: Request, res: Response) => {
    const symbolsQuery = req.query.symbols as string;
    const symbols = symbolsQuery?.split(",") || ["NSE:SBIN-EQ"];
    const broker = getBroker();

    await withSystemRetry(res, (token) => broker.getQuotes(token, symbols));
});

// GET /api/market/depth?symbols=NSE:SBIN-EQ
export const getMarketDepth = asyncHandler(async (req: Request, res: Response) => {
    const symbolsQuery = req.query.symbols as string;
    const symbols = symbolsQuery?.split(",") || ["NSE:SBIN-EQ"];
    const broker = getBroker();

    await withSystemRetry(res, (token) => broker.getMarketDepth(token, symbols));
});

// GET /api/market/history?symbol=NSE:SBIN-EQ&resolution=D&from=2024-01-01&to=2024-04-16
export const getHistory = asyncHandler(async (req: Request, res: Response) => {
    const { symbol, resolution, from, to } = req.query as Record<string, string>;
    const broker = getBroker();

    await withSystemRetry(res, (token) => broker.getHistory(token, symbol, resolution, from, to));
});