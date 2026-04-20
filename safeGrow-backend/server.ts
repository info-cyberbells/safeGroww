import "./src/config/loadEnv.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import { initMarketData } from "./src/services/marketData.service.js";
import authRoutes from "./src/routes/auth.routes.js";
import marketRoutes from "./src/routes/market.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

await connectDB();

// Initialize market data: loads token from DB or logs in fresh.
// Cron refreshes token daily at 8:55 AM IST.
// Uses SERVER's own API keys — completely separate from user login.
await initMarketData();

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("API Running");
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Backend Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        details: err
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});