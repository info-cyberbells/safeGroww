import { Response } from "express";
import { getBrokerByName } from "../brokers/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const getDashboardSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const accessToken = req.brokerToken; 

    if (!user || !accessToken) {
        return res.status(401).json({
            success: false,
            message: "User session not found or broker token missing."
        });
    }
    
    const brokerName = user.broker;
    console.log(`[Dashboard] Fetching data for user: ${user.name} via broker: ${brokerName.toUpperCase()}`);

    const broker = getBrokerByName(brokerName);

    const profile = await broker.getUserProfile(accessToken);
    const funds = broker.getFunds ? await broker.getFunds(accessToken) : { balance: 0 };
    const holdings = broker.getHoldings ? await broker.getHoldings(accessToken) : [];
    const positions = broker.getPositions ? await broker.getPositions(accessToken) : [];
    const orders = broker.getOrders ? await broker.getOrders(accessToken) : [];
    const tradebook = broker.getTradebook ? await broker.getTradebook(accessToken) : [];

    res.json({
        success: true,
        data: { 
            broker: brokerName,
            profile, 
            funds, 
            holdings, 
            positions, 
            orders, 
            tradebook 
        },
    });
});