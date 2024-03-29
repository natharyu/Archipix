import fs from "fs";
import jwt from "jsonwebtoken";
import { checkExisting, deleteFile, uploadFile } from "../../../config/S3.js";
import File from "../../../model/File.model.js";
import Folder from "../../../model/Folder.model.js";
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
    const files = fs.readdirSync(`uploads/${req.params.rootFolder}/tmp`);
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
    await files.map(async (file) => {
      const [existingFileName] = await File.getOneByField("label", file.name);
      if (existingFileName || fs.existsSync(`./uploads/${req.body.path}/${file.name}`)) {
        console.log("File already exists");
        return;
      } else {
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
        await checkExistingFile();
        const destination = `${req.body.path}/${file.name}`;
        const fileContent = Buffer.from(file.data, "binary");
        await uploadFile(destination, file, fileContent);
      }
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
    const completePath = `${req.body.path}/${file.label}`;
    const existingFile = await checkExisting(completePath);

    if (existingFile) {
      await deleteFile(completePath);
    }
    await File.deleteOne(file.id);
    return res.json({ message: "Fichier supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const deleteManyFiles = async (req, res) => {
  try {
    const { files, folders, path } = req.body;
    if (files.length > 0) {
      files.map(async (file) => {
        const [existingFile] = await File.getOneByField("id", file.id);
        if (existingFile || fs.existsSync(`./uploads/${path}/${existingFile.label}`)) {
          fs.unlinkSync(`./uploads/${path}/${existingFile.label}`);
          const command = new DeleteObjectCommand({
            Bucket: "archipix",
            Key: file.label,
          });
          s3Client.send(command);
          await File.deleteOne(existingFile.id);
        }
      });
    }
    if (folders.length > 0) {
      folders.map(async (folder) => {
        const [existingFolder] = await Folder.getOneById(folder.id);
        if (existingFolder || fs.existsSync(`./uploads/${path}/${existingFolder.id}`)) {
          fs.rmSync(`./uploads/${path}/${existingFolder.id}`, { recursive: true });
          await Folder.deleteOne(existingFolder.id);
        }
      });
    }
    return res.json({
      message: "Sélection des fichiers supprimé avec succès !",
    });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getOne, getFilePreview, add, deleteOneFile, deleteManyFiles };
