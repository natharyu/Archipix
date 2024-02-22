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
    const files = await fs.readdirSync(`uploads/${req.params.rootFolder}/tmp`);
    if (files.length > 0) {
      files.map(async (file) => fs.unlinkSync(`uploads/${req.params.rootFolder}/tmp/${file}`));
    }
    const [file] = await File.getOneByField("id", req.params.id);
    if (!file) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    const path = req.params.path.replace("&&&", "/");

    fs.copyFile(
      `uploads/${path}/${req.params.label}`,
      `uploads/${req.params.rootFolder}/tmp/${req.params.label}`,
      (err) => {
        if (err) throw err;
      }
    );
    return res.json(file);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getFilePreview = async (req, res) => {
  try {
    fs.readFile(`./uploads/${req.params.rootFolder}/tmp/${req.params.fileName}`, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Une erreur est survenue" });
      }
      return res.write(data);
    });
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

const deleteOneFile = async (req, res) => {
  try {
    const [file] = await File.getOneByField("id", req.body.file_id);
    if (!file) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    if (!fs.existsSync(`./uploads/${req.body.path}/${file.label}`)) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    fs.unlinkSync(`./uploads/${req.body.path}/${file.label}`);
    await File.deleteOne(file.id);
    return res.json({ message: "Fichier supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getOne, getFilePreview, add, deleteOneFile };
