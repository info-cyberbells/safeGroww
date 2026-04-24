import { EventEmitter } from "events";
import MarketCandle from "../models/MarketCandle.js";

class MarketStore extends EventEmitter {
    private ticks: Record<string, any> = {};
    private status: "online" | "offline" = "offline";

    // 🕯️ Candle Tracking
    private currentCandles: Record<string, any> = {};
    private lastMinute = new Date().getMinutes();

    public setStatus(newStatus: "online" | "offline") {
        this.status = newStatus;
        this.emit("statusChange", this.status);
    }

    public getStatus() {
        return this.status;
    }

    /**
     * Pre-populates the store with the last known prices from the database.
     */
    public async loadLastPrices() {
        try {
            console.log("[MarketStore] Pre-loading last known prices from DB...");
            const symbols = await MarketCandle.distinct("symbol");
            
            for (const symbol of symbols) {
                const lastCandle = await MarketCandle.findOne({ symbol })
                    .sort({ timestamp: -1 });
                
                if (lastCandle) {
                    this.ticks[symbol] = {
                        symbol,
                        ltp: lastCandle.close,
                        open: lastCandle.open,
                        high: lastCandle.high,
                        low: lastCandle.low,
                        close: lastCandle.close,
                        volume: lastCandle.volume,
                        lastUpdated: new Date(lastCandle.timestamp)
                    };
                }
            }
            console.log(`[MarketStore] Loaded prices for ${Object.keys(this.ticks).length} symbols.`);
        } catch (err) {
            console.error("[MarketStore] Failed to load last prices:", err);
        }
    }

    /**
     * Updates a tick and also updates the current 1-minute candle OHLC.
     */
    public update(symbol: string, data: any) {
        const price = data.ltp || data.lp || 0;
        if (!price) return;

        // 1. Update Tick
        this.ticks[symbol] = {
            ...this.ticks[symbol],
            ...data,
            lastUpdated: new Date(),
        };

        // 2. Update current moving 1-min Candle
        if (!this.currentCandles[symbol]) {
            this.currentCandles[symbol] = {
                open: price, high: price, low: price, close: price, volume: data.volume || 0,
                timestamp: Math.floor(Date.now() / 60000) * 60000 // Start of minute
            };
        } else {
            const c = this.currentCandles[symbol];
            c.high = Math.max(c.high, price);
            c.low = Math.min(c.low, price);
            c.close = price;
            if (data.volume) c.volume = data.volume;
        }

        this.emit(`tick:${symbol}`, this.ticks[symbol]);
        this.emit("tick", this.ticks[symbol]);

        // 3. Check for Minute Crossover and Save
        const nowMinute = new Date().getMinutes();
        if (nowMinute !== this.lastMinute) {
            this.lastMinute = nowMinute;
            this.saveCompletedCandles();
        }
    }

    private async saveCompletedCandles() {
        const symbols = Object.keys(this.currentCandles);
        if (symbols.length === 0) return;

        console.log(`[MarketStore] Saving ${symbols.length} live candles to DB...`);
        const candlesToSave = { ...this.currentCandles };
        this.currentCandles = {}; // Reset for next minute

        try {
            const ops = Object.entries(candlesToSave).map(([symbol, c]: [string, any]) => ({
                updateOne: {
                    filter: { symbol, resolution: "1", timestamp: c.timestamp },
                    update: { $set: { ...c, symbol, resolution: "1" } },
                    upsert: true,
                }
            }));
            await MarketCandle.bulkWrite(ops, { ordered: false });
        } catch (err) {
            console.error("[MarketStore] Live save failed:", err);
        }
    }

    public getTick(symbol: string) {
        return this.ticks[symbol] || null;
    }

    public getAllTicks() {
        return this.ticks;
    }

    public clear() {
        this.ticks = {};
    }
}

export const marketStore = new MarketStore();
