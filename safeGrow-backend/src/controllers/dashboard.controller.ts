import { Request, Response, NextFunction } from "express";
import getBroker from "../brokers/index.js";

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken } = req.query;

        if (!accessToken || typeof accessToken !== "string") {
            res.status(400).json({ success: false, message: "accessToken is required" });
            return;
        }

        const broker = getBroker();

        const [profile, funds, holdings, positions, orders, tradebook] = await Promise.all([
            broker.getUserProfile(accessToken),
            broker.getFunds(accessToken),
            broker.getHoldings(accessToken),
            broker.getPositions(accessToken),
            broker.getOrders(accessToken),
            broker.getTradebook(accessToken),
        ]);

        res.json({
            success: true,
            data: { profile, funds, holdings, positions, orders, tradebook },
        });
    } catch (err) {
        next(err);
    }
};