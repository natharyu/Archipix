import express from "express";
import userController from "../../../controller/api/v1/user.controller.js";

const userRoutes = express.Router();
//route prefix: /api/v1/user

//get routes
userRoutes.get("/get/info/:email", userController.getUserInfo);
userRoutes.get("/total", userController.getTotalUsers);
userRoutes.get("/all", userController.getAll);

export default userRoutes;
