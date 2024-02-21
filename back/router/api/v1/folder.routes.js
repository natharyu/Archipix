import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import folderController from "../../../controller/api/v1/folder.controller.js";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";

const folderRoutes = express.Router();
//route prefix: /api/v1/folder

folderRoutes.get("/get/:parent_id", folderController.get);
folderRoutes.get("/getPath/:folder_id", folderController.getPath);
folderRoutes.get("/getRoot", async (req, res) => {
  try {
    const sessionToken = req.cookies["Session"];
    const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
    const [user] = await User.getOneByField("id", data.id);
    return res.json({
      rootFolder: user.storage,
      currentFolder: user.storage,
      rootFolderName: user.username,
      currentFolderName: user.username,
    });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
});

folderRoutes.get("/getCurrent", async (req, res) => {
  try {
    // const sessionToken = req.cookies["Session"];
    // const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
    // const [user] = await User.getOneByField("id", data.id);
    const read = fs.readdirSync(`./uploads/23b0e678-c681-11ee-9b24-94188276c27c`, {
      withFileTypes: true,
      recursive: true,
    });
    return res.json({
      read: read,
    });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
});

folderRoutes.post("/create", async (req, res) => {
  try {
    const sessionToken = req.cookies["Session"];
    const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
    const [user] = await User.getOneByField("id", data.id);
    const [newFolderId] = await Query.generateUUID();

    try {
      if (!fs.existsSync(`./uploads/${req.body.path}/${newFolderId.uuid}`)) {
        fs.mkdirSync(`./uploads/${req.body.path}/${newFolderId.uuid}`);
        const newFolder = await Folder.create({
          id: newFolderId.uuid,
          user_id: user.id,
          parent_id: req.body.currentFolder,
          label: req.body.newFolderName,
          created_at: new Date(),
        });
        if (!newFolder) {
          return res.status(409).json({ error: "Erreur lors de la création du dossier" });
        }
      }
    } catch (err) {
      console.error(err);
    }

    return res.json({ message: "Dossier creé avec succes" });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
});

//delete routes
folderRoutes.delete("/delete", folderController.deleteOneFolder);

export default folderRoutes;
