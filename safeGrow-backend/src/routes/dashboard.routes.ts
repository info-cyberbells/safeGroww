import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user-data", authMiddleware, getDashboardSummary);

export default router;