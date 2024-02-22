import fs from "fs";
import jwt from "jsonwebtoken";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";

const get = async (req, res) => {
  try {
    const folders = await Folder.getByField("parent_id", req.params.parent_id);
    return res.json(folders);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getPath = async (req, res) => {
  try {
    const path = [];
    const pathName = [];
    const buildPath = async (folder_id) => {
      const [folder] = await Folder.getOneById(folder_id);
      if (folder.parent_id !== null) {
        path.push(folder.id);
        pathName.push(folder.label);
        await buildPath(folder.parent_id);
      } else {
        path.push(folder.id);
        pathName.push(folder.label);
      }
    };
    await buildPath(req.params.folder_id);
    return res.json({ path: path.reverse(), pathName: pathName.reverse() });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getRoot = async (req, res) => {
  try {
    const { Session: sessionToken } = req.cookies;
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
};

const create = async (req, res) => {
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
};

const deleteOneFolder = async (req, res) => {
  try {
    const [folder] = await Folder.getOneById(req.body.folder_id);
    if (!folder) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }
    const path = `./uploads/${req.body.path}/${folder.id}`;
    if (!fs.existsSync(path)) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }
    fs.rmSync(path, { recursive: true });
    await Folder.deleteOne(folder.id);
    return res.json({ message: "Dossier supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getPath, getRoot, create, deleteOneFolder };
