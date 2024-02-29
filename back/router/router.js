import express from "express";
import apiRoutes from "./api/api.routes.js";
import authRoutes from "./auth/auth.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);

export default router;
