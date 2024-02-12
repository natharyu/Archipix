import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";

const folderRoutes = express.Router();
//route prefix: /api/v1/folder

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

folderRoutes.post("/create", async (req, res) => {
  // try {
  const sessionToken = req.cookies["Session"];
  const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
  const [user] = await User.getOneByField("id", data.id);
  const [newFolderId] = await Query.generateUUID();
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
  try {
    if (!fs.existsSync(`./uploads/${req.body.currentFolder}/${newFolderId.uuid}`)) {
      fs.mkdirSync(`./uploads/${req.body.currentFolder}/${newFolderId.uuid}`);
    }
  } catch (err) {
    console.error(err);
  }

  // } catch (error) {
  //   return res.status(500).json({ error: "Une erreur est survenue" });
  // }
});

export default folderRoutes;
