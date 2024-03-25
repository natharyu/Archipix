import express from "express";
import folderController from "../../../controller/api/v1/folder.controller.js";

const folderRoutes = express.Router();
//route prefix: /api/v1/folder

//get routes
folderRoutes.get("/get/:parent_id", folderController.get);
folderRoutes.get("/getPath/:folder_id", folderController.getPath);
folderRoutes.get("/getRoot", folderController.getRoot);
folderRoutes.get("/download/:path/:folder_id", folderController.download);

//post routes
folderRoutes.post("/create", folderController.create);

//delete routes
folderRoutes.delete("/delete", folderController.deleteOneFolder);

export default folderRoutes;
