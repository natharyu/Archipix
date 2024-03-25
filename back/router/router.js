import express from "express";
import path from "path";
import apiRoutes from "./api/api.routes.js";
import authRoutes from "./auth/auth.routes.js";
import { adminOnly } from "./middleware/middleware.js";

const router = express.Router();
const __dirname = path.resolve();

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);

router.get("/admin*", adminOnly, (req, res) => {
  res.sendFile(path.join(__dirname, "views/dist", "index.html"));
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views/dist", "index.html"));
});

export default router;
