import { IBroker, Candle } from "../IBroker.js";
import { loginXTS, getXTSToken } from "./xts.auth.js";
import { startXTSWebSocket, getXTSLatestTick } from "./xts.websocket.service.js";
import { fetchXTSHistoricalData } from "./xts.historical.service.js";

export class FivePaisaBroker implements IBroker {

    // XTS has NO browser login URL
    // login happens via API keys directly
    generateLoginUrl(): string {
        return ""; // not applicable for XTS
    }

    async getAccessToken(userID: string, password?: string) {
        // XTS login happens via loginXTS()
        // not via auth code flow
        return loginXTS();
    }

    async getUserProfile(accessToken: string) {
        // XTS doesn't have user profile endpoint
        // return basic info
        return { name: "XTS User", token: getXTSToken() };
    }

    async startLive(): Promise<void> {
        // Login already handled in auth controller before this is called
        // Just start the WebSocket with the existing token
        await startXTSWebSocket();
    }

    getLatestTick(symbol?: string) {
        const ticks = getXTSLatestTick();
        if (symbol) return ticks[symbol] ?? null;
        return ticks;
    }

    async fetchHistorical(
        symbol: string,
        resolution: string,
        from?: string,
        to?: string
    ): Promise<Candle[]> {
        // XTS uses instrumentID not symbol string
        // symbol format expected: "1:22" (segment:instrumentID)
        const [segment, instrumentID] = symbol.split(":");

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