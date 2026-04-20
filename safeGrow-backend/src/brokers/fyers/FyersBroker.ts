import { IBroker, Tick, Candle } from "../IBroker.js";

// import EXISTING files 
import { generateLoginUrl, getAccessToken, getUserProfile } from "./fyers.auth.js";
import { fetchHistoricalData } from "./historical.service.js";
import { startFyersWebSocket, getLatestTick } from "./websocket.service.js";

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

    // ── HISTORICAL ────────────────────────────────
    async fetchHistorical(
        symbol: string,
        resolution: string,
        from?: string,
        to?: string
    ): Promise<Candle[]> {
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
}