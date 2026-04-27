import { Request, Response, NextFunction } from "express";
import { getBrokerByName } from "../brokers/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
    const { accessToken } = req.query;

    if (!accessToken || typeof accessToken !== "string") {
        return res.status(400).json({ success: false, message: "accessToken is required" });
    }

    // 1. Identify which broker this user belongs to by looking up their session
    const user = await User.findOne({ accessToken });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token. Please login again."
        });
    }

    const brokerName = user.broker;
    console.log(`[Dashboard] Fetching data for user: ${user.name} via broker: ${brokerName.toUpperCase()}`);

    const broker = getBrokerByName(brokerName);

    // 2. Fetch all dashboard data using the CORRECT broker instance
    const profile = await broker.getUserProfile(accessToken);
    const funds = broker.getFunds ? await broker.getFunds(accessToken) : { balance: 0 };
    const holdings = broker.getHoldings ? await broker.getHoldings(accessToken) : [];
    const positions = broker.getPositions ? await broker.getPositions(accessToken) : [];
    const orders = broker.getOrders ? await broker.getOrders(accessToken) : [];
    const tradebook = broker.getTradebook ? await broker.getTradebook(accessToken) : [];

    res.json({
        success: true,
        data: {
            broker: brokerName, // Tell the UI which broker data this is
            profile,
            funds,
            holdings,
            positions,
            orders,
            tradebook
        },
    });
});