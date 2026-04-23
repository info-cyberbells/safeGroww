import fyersModel from "fyers-api-v3";
import User from "../../models/User.js";

export const fetchHistoricalData = async (
    symbol: string,
    resolution: string,
    from?: string,   // "YYYY-MM-DD"
    to?: string
) => {
    const user = await User.findOne().sort({ _id: -1 });
    if (!user?.accessToken) throw new Error("No access token");

    const fyers = new fyersModel.fyersModel();
    fyers.setAppId(process.env.FYERS_CLIENT_ID!);
    fyers.setAccessToken(user.accessToken);

    const toTs = to ? Math.floor(new Date(to).getTime() / 1000)
        : Math.floor(Date.now() / 1000);
    const fromTs = from ? Math.floor(new Date(from).getTime() / 1000)
        : toTs - 30 * 24 * 60 * 60; // default: last 30 days

    console.log(`[Fyers History] Fetching ${symbol} (${resolution}) from ${from} to ${to}...`);

    const performFetch = async (targetSymbol: string) => {
        return await fyers.getHistory({
            symbol: targetSymbol,
            resolution,
            date_format: "0",
            range_from: String(fromTs),
            range_to: String(toTs),
            cont_flag: "1",
        });
    };

    let response = await performFetch(symbol);

    // 💡 AUTO-RETRY LOGIC: If standard symbol fails, try without -EQ suffix
    if (response.s !== "ok" && symbol.endsWith("-EQ")) {
        const fallback = symbol.replace("-EQ", "");
        console.warn(`[Fyers History] ${symbol} failed. Trying fallback: ${fallback}`);
        response = await performFetch(fallback);
    }

    if (response.s !== "ok") {
        console.error(`[Fyers History] Error for ${symbol}:`, response);
        throw new Error(response.message || "Fyers history fetch failed");
    }

    // Map Raw Array [ts, o, h, l, c, v] to Object
    return response.candles.map((candle: any[]) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5]
    }));
};