
import mongoose from "mongoose";

const MarketCandleSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    resolution: { type: String, required: true }, // e.g., '1', '5', 'D'
    timestamp: { type: Number, required: true }, // Epoch timestamp
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    volume: { type: Number, required: true },
}, { 
    timestamps: true 
});

// Optimization: Indexing for fast lookups
MarketCandleSchema.index({ symbol: 1, resolution: 1, timestamp: -1 });
// Unique constraint to prevent duplicate data for the same time
MarketCandleSchema.index({ symbol: 1, resolution: 1, timestamp: 1 }, { unique: true });

const MarketCandle = mongoose.model("MarketCandle", MarketCandleSchema);
export default MarketCandle;
