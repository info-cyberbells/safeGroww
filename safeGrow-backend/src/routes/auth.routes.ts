import express from "express";
import { login, callback, adminLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", login);
router.get("/admin/login", adminLogin);
router.get("/callback", callback);

export default router;