import express from "express";
// import path from "path";
import apiRoutes from "./api/api.routes.js";
import authRoutes from "./auth/auth.routes.js";

const router = express.Router();
// const __dirname = path.resolve();

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Handle API routes
router.use("/api", apiRoutes);

// Handle auth routes
router.use("/auth", authRoutes);

// // Handle admin routes
// router.get("/admin*", adminOnly, (req, res) => {
//   // Send index.html for admin views
//   res.sendFile(path.join(__dirname, "views/", "index.html"));
// });

// // Handle client routes
// router.get("*", (req, res) => {
//   // Send index.html for client views
//   res.sendFile(path.join(__dirname, "views/", "index.html"));
// });

export default router;
