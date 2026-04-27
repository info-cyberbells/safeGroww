import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const JWT_SECRET = process.env.JWT_SECRET || "safegrow_secret_key_change_me_in_production";

export interface AuthRequest extends Request {
    user?: any;
    brokerToken?: string;
}

/**
 * authMiddleware
 * Reads the 'safegrow_session' HttpOnly cookie, verifies it, 
 * and attaches the user and their broker accessToken to the request.
 */
export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get token from cookies
    console.log(`[AuthMiddleware] Cookies received:`, req.cookies);
    const sessionToken = req.cookies?.safegrow_session;

    if (!sessionToken) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please login."
        });
    }

    try {
        // 2. Verify JWT
        const decoded: any = jwt.verify(sessionToken, JWT_SECRET);

        // 3. Find user in database
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists. Please login again."
            });
        }

        // 4. Check if broker token is still valid (optional, but good for UX)
        // For now, we just pass it along
        req.user = user;
        req.brokerToken = user.accessToken;

        next();
    } catch (err) {
        console.error("[AuthMiddleware] JWT Verification Failed:", err);
        return res.status(401).json({
            success: false,
            message: "Session expired or invalid. Please login again."
        });
    }
});
