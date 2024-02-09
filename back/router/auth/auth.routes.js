import express from "express";
import authController from "../../controller/auth/auth.controller.js";

const authRoutes = express.Router();
//route prefix: /auth

//Get Routes
authRoutes.get("/verify-email/:token", authController.verifyEmail);
authRoutes.get("/logout", authController.logout);
authRoutes.get("/refresh", authController.refresh);

//Post Routes
authRoutes.post("/signup", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/reset-password", authController.resetPassword);
authRoutes.post("/reset-password/:token", authController.resetPasswordVerify);

export default authRoutes;
