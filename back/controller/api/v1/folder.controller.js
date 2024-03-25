import archiver from "archiver";
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

/**
 * Download a folder and its contents as a zip file.
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
const download = async (req, res) => {
  try {
    // Get the folder from the database
    const [folder] = await Folder.getOneById(req.params.folder_id);
    // If the folder doesn't exist, return a 404
    if (!folder) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }

    /**
     * Build the path to the folder to be downloaded.
     * @type {string}
     */
    const path = `./uploads/${req.params.path.replace("&&&", "/")}/${folder.id}`;

    /**
     * Build the name of the zip file to be downloaded.
     * @type {string}
     */
    const zipName = `${folder.id}.zip`;

    /**
     * Build the path to the downloaded zip file.
     * @type {string}
     */
    const out = `./uploads/tmp/${zipName}`;

    const existingArchive = fs.existsSync(out);
    if (existingArchive) {
      fs.unlink(out, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    // Create a new zip archive
    const archive = archiver("zip", { zlib: { level: 9 } });
    // Create a write stream for the archive
    const stream = fs.createWriteStream(out);

    // Add the folder to the archive and pipe it to the response
    archive
      .directory(path, false)
      .on("error", (err) => {
        throw err;
      })
      .pipe(stream);

    // When the archive has been finalized, send the file to the user
    stream.on("close", () => {
      res.download(out, (err) => {
        if (err) {
          console.error(err);
        } else {
          // Delete the downloaded zip file after a short delay
          setTimeout(() => {
            fs.unlink(out, (err) => {
              if (err) {
                console.error(err);
              }
            });
          }, 3000);
        }
      });
    });

    /**
     * Finalize the archive and send it to the user.
     */
    archive.finalize();
  } catch (error) {
    console.error(error);
    // If an error occurs, send a 500 response
    // return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getPath, getRoot, create, deleteOneFolder, download };
