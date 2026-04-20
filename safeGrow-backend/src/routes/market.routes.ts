import { Router, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import getBroker from "../brokers/index.js";
import { marketStore } from "../services/marketStore.service.js";
import MarketCandle from "../models/MarketCandle.js";

const router = Router();


// GET /api/market/status
router.get("/status", (req: Request, res: Response) => {
  res.json({
    success: true,
    status: marketStore.getStatus(),
    symbolsTracked: Object.keys(marketStore.getAllTicks()).length
  });
});

// GET /api/market/live
router.get("/live", (req: Request, res: Response) => {
  // Use the central specialized market store for normalized data
  const data = marketStore.getAllTicks();
  res.json({ success: true, data });
});

// GET /api/market/historical
router.get("/historical", asyncHandler(async (req: Request, res: Response) => {
  const { symbol = "NSE:SBIN-EQ", resolution = "D", from, to } = req.query;
  const s = symbol.toString();
  const r = resolution.toString();

  // 🕵️ CACHE CHECK: Check DB first before hitting the Broker API
  const fromTs = from ? Math.floor(new Date(from as string).getTime() / 1000) : 0;
  const toTs = to ? Math.floor(new Date(to as string).getTime() / 1000) : Math.floor(Date.now() / 1000);

  const cachedData = await MarketCandle.find({
    symbol: s,
    resolution: r,
    timestamp: { $gte: fromTs, $lte: toTs }
  }).sort({ timestamp: 1 }).lean();

  if (cachedData.length > 0) {
    console.log(`[Market] Serving ${cachedData.length} candles from CACHE for ${s}`);
    return res.json({ success: true, data: cachedData, source: "database" });
  }

  console.log(`[Market] Cache Miss for ${s}. Fetching from Broker API...`);
  const broker = getBroker();
  
  const data = await broker.fetchHistorical(
    s,
    r,
    from as string,
    to as string
  );

  // 📝 PERSISTENT STORAGE: Save fetched candles to DB (Priority 1a)
  // We use bulkWrite for maximum performance
  if (data && data.length > 0) {
    try {
      const s = symbol.toString();
      const r = resolution.toString();

      const ops = data.map((c: any) => ({
        updateOne: {
          filter: { symbol: s, resolution: r, timestamp: c.timestamp },
          update: { $set: { ...c, symbol: s, resolution: r } },
          upsert: true,
        }
      }));
      await MarketCandle.bulkWrite(ops as any[], { ordered: false });
    } catch (err) {
      console.error("[Market] Bulk save to DB failed:", err);
    }
  }

  res.json({ success: true, data });
}));

export default router; 