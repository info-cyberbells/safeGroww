import { IBroker, Tick, Candle } from "../IBroker.js";

// import EXISTING files 
import { generateLoginUrl, getAccessToken, getUserProfile } from "./fyers.auth.js";
import { fetchHistoricalData } from "./historical.service.js";
import { startFyersWebSocket, getLatestTick } from "./websocket.service.js";
import { getFunds, getHoldings, getOrders, getPositions, getTradebook } from "./fyers.dashboard.js";

export class FyersBroker implements IBroker {

    // ── LIVE ──────────────────────────────────────
    async startLive(): Promise<void> {
        await startFyersWebSocket();
    }

    getLatestTick(symbol?: string) {
        const ticks = getLatestTick();
        if (symbol) return ticks[symbol] ?? null;
        return ticks;
    }

    // ── MARKET DATA ──────────────────────────────
    async getQuotes(accessToken: string, symbols: string[]) {
        const { getQuotes } = await import("./fyers.dashboard.js");
        return getQuotes(accessToken, symbols);
    }

    async getMarketDepth(accessToken: string, symbols: string[]) {
        const { getMarketDepth } = await import("./fyers.dashboard.js");
        return getMarketDepth(accessToken, symbols);
    }

    async getHistory(
        accessToken: string,
        symbol: string,
        resolution: string,
        from?: string,
        to?: string
    ): Promise<any> {
        return fetchHistoricalData(symbol, resolution, from, to);
    }

    // ── AUTH ──────────────────────────────────────
    generateLoginUrl(): string {
        return generateLoginUrl();
    }

    async getAccessToken(authCode: string, password?: string) {
        return getAccessToken(authCode);
    }

    async getUserProfile(accessToken: string) {
        return getUserProfile(accessToken);
    }

    async getFunds(accessToken: string) {
        return getFunds(accessToken);
    }

    async getHoldings(accessToken: string) {
        return getHoldings(accessToken);
    }

    async getPositions(accessToken: string) {
        return getPositions(accessToken);
    }

    async getOrders(accessToken: string) {
        return getOrders(accessToken);
    }

    async getTradebook(accessToken: string) {
        return getTradebook(accessToken);
    }
}