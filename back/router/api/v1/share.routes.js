import express from "express";
import fileController from "../../../controller/api/v1/file.controller.js";
import folderController from "../../../controller/api/v1/folder.controller.js";
import shareController from "../../../controller/api/v1/share.controller.js";

const shareRoutes = express.Router();
//route prefix: /api/v1/share

//get routes
shareRoutes.get("/verify/:id", shareController.verifyLink);
shareRoutes.get("/get/files/:folder_id", fileController.get);
shareRoutes.get("/get/file/:id", fileController.getOne);
shareRoutes.get("/get/folders/:parent_id", folderController.get);
shareRoutes.get("/getPath/:folder_id", folderController.getPath);
shareRoutes.get("/download/file/:path/:file_id", fileController.download);
shareRoutes.get("/download/folder/:path/:folder_id", folderController.download);

//post routes
shareRoutes.post("/file", shareController.shareFile);
shareRoutes.post("/folder", shareController.shareFolder);

//delete routes
shareRoutes.delete("/delete/:id", shareController.deleteOne);

export default shareRoutes;
