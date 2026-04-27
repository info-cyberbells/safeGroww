import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SystemBroker from "../models/SystemBroker.js";
import asyncHandler from "../utils/asyncHandler.js";
import { FyersBroker } from "../brokers/fyers/index.js";
import { FivePaisaBroker } from "../brokers/fivepaisa/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "safegrow_secret_key_change_me_in_production";


const setSessionCookie = (res: Response, userId: string) => {
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

    console.log(`[Auth] Setting session cookie for user: ${userId}`);

    res.cookie("safegrow_session", token, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// factory per request — not global
const getBrokerInstance = (brokerName: string) => {
    if (brokerName === "fyers") return new FyersBroker();
    if (brokerName === "fivepaisa") return new FivePaisaBroker();
    throw new Error(`Unsupported broker: ${brokerName}`);
};

// ─── UNIFIED LOGIN ────────────────────────────────────
// POST /api/auth/login
// { broker: "fyers" }
// { broker: "fivepaisa", userID: "xxx", password: "yyy" }
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { broker, userID, password } = { ...req.query, ...req.body } as any;

    if (!broker) {
        return res.status(400).json({
            success: false,
            message: "broker is required"
        });
    }

    const brokerInstance = getBrokerInstance(broker);

    // Fyers → returns login URL (browser redirect)
    if (broker === "fyers") {
        const url = brokerInstance.generateLoginUrl();
        return res.json({ success: true, url });
    }

    // 5paisa → direct login with credentials
    if (broker === "fivepaisa") {
        if (!userID || !password) {
            return res.status(400).json({
                success: false,
                message: "userID and password required for 5paisa"
            });
        }

        const result = await brokerInstance.getAccessToken(userID, password);

        // Save session to DB
        const user = await User.findOneAndUpdate(
            { xtsUserID: result.userID },
            {
                broker: "fivepaisa",
                accessToken: result.token,
                xtsUserID: result.userID,
                tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            { upsert: true, returnDocument: "after" }
        );


        if (user) setSessionCookie(res, user._id.toString());

        return res.json({
            success: true,
            message: "Login successful",
            data: {
                userID: result.userID,
                token: result.token, // Still return broker token for the store if needed
                redirect: "/dashboard"
            }
        });
    }
});

// ─── ADMIN/SYSTEM LOGIN ──────────────────────────────
// This is for starting the server's shared market data feed.
// POST /api/auth/admin/login?broker=fyers
// POST /api/auth/admin/login?broker=fivepaisa
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const { broker, secret } = { ...req.query, ...req.body } as any;

    // 🔒 Security: Only allow admin login if the secret matches .env
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "safegrow_dev_secret";
    if (secret !== ADMIN_SECRET) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid admin secret"
        });
    }

    if (!broker) {
        return res.status(400).json({ success: false, message: "broker is required" });
    }

    const brokerInstance = getBrokerInstance(broker as string);

    // FivePaisa Admin Login (Auto with keys)
    if (broker === "fivepaisa") {
        const { refreshMarketDataToken } = await import("../services/marketData.service.js");
        await refreshMarketDataToken();
        return res.json({ success: true, message: "FivePaisa System token refreshed successfully" });
    }

    // Fyers Admin Login (Redirect with 'system' state)
    if (broker === "fyers") {
        const url = brokerInstance.generateLoginUrl();
        // Check if the URL already has a ? or query params
        const separator = url.includes("?") ? "&" : "?";

        // If the SDK already added a state, we need to replace it or ensure 'system' is used
        let adminUrl = url.includes("state=")
            ? url.replace(/state=[^&]*/, "state=system")
            : `${url}${separator}state=system`;

        return res.json({ success: true, url: adminUrl });
    }

    res.status(400).json({ success: false, message: "Unsupported admin broker" });
});

// ─── FYERS CALLBACK ONLY ──────────────────────────────
// GET /api/auth/callback
// Checks for state=system to save to SystemBroker vs User collections
export const callback = asyncHandler(async (req: Request, res: Response) => {
    const { auth_code, state } = req.query;
    console.log(`[Auth Callback] Hit with code: ${auth_code?.toString().slice(0, 10)}... and state: ${state}`);

    if (typeof auth_code !== "string") {
        return res.status(400).json({ success: false, message: "Invalid auth_code" });
    }

    const brokerInstance = new FyersBroker();
    const tokenData = await brokerInstance.getAccessToken(auth_code);

    const jwtPayload = JSON.parse(
        Buffer.from(tokenData.access_token.split(".")[1], "base64").toString("utf-8")
    );

    // Case 1: System Admin Login
    if (state === "system") {
        await SystemBroker.findOneAndUpdate(
            { broker: "fyers" },
            {
                broker: "fyers",
                accessToken: tokenData.access_token,
                userID: jwtPayload.fy_id,
                tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            { upsert: true, returnDocument: "after" }
        );

        await brokerInstance.startLive();
        return res.send("<h1>System Market Data (Fyers) Authorized!</h1><p>You can close this window.</p>");
    }

    // Case 2: Regular User Login
    const profile = await brokerInstance.getUserProfile(tokenData.access_token);
    const user = await User.findOneAndUpdate(
        { fyId: jwtPayload.fy_id },
        {
            broker: "fyers",
            accessToken: tokenData.access_token,
            fyId: jwtPayload.fy_id,
            name: profile.name,
            email: profile.email_id,
            mobile: profile.mobile_number,
            pan: profile.PAN,
            tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        { upsert: true, returnDocument: "after" }
    );

    if (user) setSessionCookie(res, user._id.toString());

    // Redirect to frontend callback with the broker token as a param
    // (This allows the frontend to save it in memory/state temporarily if needed)
    const frontendBaseUrl = "http://localhost:3000";
    res.redirect(`${frontendBaseUrl}/auth/callback?token=${tokenData.access_token}&broker=fyers`);
});