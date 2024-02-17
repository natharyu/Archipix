import fs from "fs";
import jwt from "jsonwebtoken";
import File from "../../../model/File.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";
const get = async (req, res) => {
  try {
    const files = await File.getAllByField("folder_id", req.params.folder_id);
    return res.json(files);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getOne = async (req, res) => {
  try {
    const files = await fs.readdirSync("uploads/tmp");
    files.map(async (file) => await fs.unlinkSync(`uploads/tmp/${file}`));
    const [file] = await File.getOneByField("id", req.params.id);
    if (!file) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    const path = req.params.path.replace("&&&", "/");

    fs.copyFile(`uploads/${path}/${req.params.label}`, `uploads/tmp/${req.params.label}`, (err) => {
      if (err) throw err;
    });
    return res.json(file);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const add = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    const sessionToken = req.cookies["Session"];
    const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
    const [user] = await User.getOneByField("id", data.id);
    if (req.files.file.length === undefined) {
      req.files.file = [req.files.file];
    }
    const files = req.files.file;
    files.map(async (file) => {
      const destination = `uploads/${req.body.path}/${file.name}`;
      if (fs.existsSync(destination)) {
        return;
      }
      file.mv(destination, function (err) {
        if (err) return res.status(500).json(err);
      });
      const checkExistingFile = async () => {
        const [fileId] = await Query.generateUUID();
        const [existingFile] = await File.getOneByField("id", fileId.uuid);
        if (!existingFile) {
          return await File.create({
            id: fileId.uuid,
            user_id: user.id,
            folder_id: req.body.currentFolder,
            label: file.name,
            size: file.size,
            type: file.mimetype,
            extension: file.name.split(".").pop(),
            created_at: new Date(),
          });
        }
        return checkExistingFile();
      };
      checkExistingFile();
    });
    return res.json({ message: "Fichiers envoyés avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getOne, add };
