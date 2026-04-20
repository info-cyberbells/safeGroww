import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/user-data", getDashboardSummary);

export default router;