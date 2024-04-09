import express from "express";
import userController from "../../../controller/api/v1/user.controller.js";

const userRoutes = express.Router();
//route prefix: /api/v1/user

//get routes
userRoutes.get("/get/info/:email", userController.getUserInfo);
userRoutes.get("/get/:id", userController.getOne);
userRoutes.get("/total", userController.getTotalUsers);
userRoutes.get("/all", userController.getAll);

//post routes
userRoutes.post("/add", userController.adminAddUser);

//put routes
userRoutes.put("/update/:id", userController.update);

//delete routes
userRoutes.delete("/delete/:id", userController.deleteOneUser);

export default userRoutes;
