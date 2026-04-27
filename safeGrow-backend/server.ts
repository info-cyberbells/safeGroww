import "./src/config/loadEnv.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./src/config/db.js";
import { initMarketData } from "./src/services/marketData.service.js";
import authRoutes from "./src/routes/auth.routes.js";
import marketRoutes from "./src/routes/market.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import { marketStore } from "./src/services/marketStore.service.js";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"],
    },
});


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

await connectDB();

// Initialize market data: loads token from DB or logs in fresh.
await initMarketData();

// 🕯️ Pre-load last known prices so UI isn't empty on boot
await marketStore.loadLastPrices();

// ─── Socket.io ───────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Immediately send current market status and all cached ticks on connect
    socket.emit("marketStatus", marketStore.getStatus());
    const allTicks = marketStore.getAllTicks();
    if (Object.keys(allTicks).length > 0) {
        socket.emit("allTicks", allTicks);
    }

    socket.on("disconnect", () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
});

// Broadcast every incoming tick to all connected frontend clients
marketStore.on("tick", (tick: any) => {
    io.emit("tick", tick);
});

// Broadcast when market goes online/offline
marketStore.on("statusChange", (status: "online" | "offline") => {
    io.emit("marketStatus", status);
});
// ─────────────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("SafeGrow API Running ✅");
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Backend Error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        details: err,
    });
});

const port = process.env.PORT || 5000;
const activeBroker = process.env.BROKER || "fivepaisa";

httpServer.listen(port, () => {
    console.log(`\n-----------------------------------------`);
    console.log(`🚀 SafeGrow backend running on port ${port}`);
    console.log(`🔌 Active Broker: ${activeBroker.toUpperCase()}`);
    console.log(`-----------------------------------------\n`);
});