import { IBroker, Candle } from "../IBroker.js";
import { loginXTS, getXTSToken } from "./xts.auth.js";
import { startXTSWebSocket, getXTSLatestTick } from "./xts.websocket.service.js";
import { fetchXTSHistoricalData } from "./xts.historical.service.js";
import { SYMBOL_TO_XTS_ID } from "./xts.mapping.js";

export class FivePaisaBroker implements IBroker {

    generateLoginUrl(): string {
        return ""; // not applicable for XTS
    }

    async getAccessToken(userID: string, password?: string) {
        return loginXTS();
    }

    async getUserProfile(accessToken: string) {
        return { name: "XTS User", token: getXTSToken() };
    }

    async getFunds(accessToken: string) {
        return { balance: 0, margin: 0 };
    }

    async getHoldings(accessToken: string) {
        return [];
    }

    async getPositions(accessToken: string) {
        return [];
    }

    async getOrders(accessToken: string) {
        return [];
    }

    async getTradebook(accessToken: string) {
        return [];
    }

    async startLive(): Promise<void> {
        await startXTSWebSocket();
    }

    getLatestTick(symbol?: string) {
        return getXTSLatestTick(symbol);
    }

    async fetchHistorical(
        symbol: string,
        resolution: string,
        from?: string,
        to?: string
    ): Promise<Candle[]> {
        // 1. Translate human-readable symbol (NSE:SBIN-EQ) to XTS ID (1:3045)
        const xtsKey = SYMBOL_TO_XTS_ID[symbol] || symbol;

        // 2. Split into segment and instrumentID
        const [segment, instrumentID] = xtsKey.split(":");

        if (!segment || !instrumentID) {
            console.error(`[XTS] No ID mapping found for symbol: ${symbol}`);
            return [];
        }

        const compressionMap: Record<string, number> = {
            "1": 1,
            "5": 5,
            "15": 15,
            "60": 60,
            "D": 1440,
        };

        return fetchXTSHistoricalData(
            segment,
            instrumentID,
            from || "",
            to || "",
            compressionMap[resolution] || 1
        );
    }
}