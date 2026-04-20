import { Request, Response } from "express";
import User from "../models/User.js";
import getBroker from "../brokers/index.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUser = () => User.findOne({ broker: process.env.BROKER });

// GET /api/market/quotes?symbols=NSE:SBIN-EQ,NSE:TCS-EQ
export const getQuotes = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser();
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found. Please login first." });
    }
    console.log(`Found user: ${user.name}, Token exists: ${!!user.accessToken}`);
    
    const broker = getBroker();
    const symbolsQuery = req.query.symbols as string;
    const symbols = symbolsQuery?.split(",") || ["NSE:SBIN-EQ"];
    const data = await broker.getQuotes(user.accessToken, symbols);
    res.json(data);
});

// GET /api/market/depth?symbols=NSE:SBIN-EQ
export const getMarketDepth = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser();
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found. Please login first." });
    }
    const broker = getBroker();
    const symbolsQuery = req.query.symbols as string;
    const symbols = symbolsQuery?.split(",") || ["NSE:SBIN-EQ"];
    const data = await broker.getMarketDepth(user.accessToken, symbols);
    res.json(data);
});

// GET /api/market/history?symbol=NSE:SBIN-EQ&resolution=D&from=2024-01-01&to=2024-04-16
export const getHistory = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser();
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found. Please login first." });
    }
    const broker = getBroker();
    const { symbol, resolution, from, to } = req.query as Record<string, string>;
    const data = await broker.getHistory(user.accessToken, symbol, resolution, from, to);
    res.json(data);
});