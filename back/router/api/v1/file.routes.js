import express from "express";
import fileController from "../../../controller/api/v1/file.controller.js";

const fileRoutes = express.Router();
//route prefix: /api/v1/file

//get routes
fileRoutes.get("/get/:folder_id", fileController.get);

//post routes
fileRoutes.post("/add", fileController.add);

export default fileRoutes;
