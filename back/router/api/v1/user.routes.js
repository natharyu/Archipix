import express from "express";
import userController from "../../../controller/api/v1/user.controller.js";
import { adminOnly } from "../../middleware/middleware.js";

const userRoutes = express.Router();
//route prefix: /api/v1/user

//get routes
userRoutes.get("/get/info/:email", userController.getUserInfo);
userRoutes.get("/get/:id", userController.getOne);
userRoutes.get("/total", userController.getTotalUsers);
userRoutes.get("/all", userController.getAll);
userRoutes.get("/get/share/:id", userController.getShare);

//post routes
userRoutes.post("/add", adminOnly, userController.adminAddUser);

//put routes
userRoutes.put("/update/:id", userController.update);

//delete routes
userRoutes.delete("/delete/:id", userController.deleteOneUser);

export default userRoutes;
