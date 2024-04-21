import jwt from "jsonwebtoken";
import File from "../../../model/File.model.js";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";
import { checkExisting, deleteFile, deleteFolder, downloadFile, uploadFile } from "../../../utils/S3.js";
/**
 * Get all files of a folder
 * @param {string} folder_id.path.required - ID of the folder
 * @returns {array<File>} 200 - List of files
 * @returns {Error} 500 - Server error
 */
const get = async (req, res) => {
  try {
    const files = await File.getAllByField("folder_id", req.params.folder_id);
    return res.json(files);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Get a file by its ID
 * @param {string} id.path.required - ID of the file
 * @returns {File} 200 - The file
 * @returns {Error} 404 - File not found
 * @returns {Error} 500 - Server error
 */
const getOne = async (req, res) => {
  try {
    const [file] = await File.getOneByField("id", req.params.id);
    if (!file) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    return res.json(file);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Add one or multiple files
 * @param {object} req.files.file.required - The file or the files to upload
 * @param {string} req.body.path.required - Path where the file(s) should be uploaded
 * @param {string} req.body.currentFolder.required - The folder ID where the file(s) should be added
 * @returns {object} 200 - Success
 * @returns {Error} 400 - No files were uploaded
 * @returns {Error} 500 - Server error
 */
const add = async (req, res) => {
  try {
    // Check if a file was actually uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    // Verify the JWT
    const sessionToken = req.cookies["Session"];
    const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
    // Get the user
    const [user] = await User.getOneByField("id", data.id);
    // If only one file is uploaded, make it an array
    if (req.files.file.length === undefined) {
      req.files.file = [req.files.file];
    }
    // Get the files
    const files = req.files.file;
    // Add each file to the database
    await files.map(async (file) => {
      // Check if the file already exists
      const [existingFileName] = await File.getOneByFieldByUser("label", file.name, user.id);
      if (
        existingFileName &&
        existingFileName.label === file.name &&
        existingFileName.size === file.size &&
        existingFileName.type === file.mimetype
      ) {
        return;
      } else {
        if (existingFileName && existingFileName.label === file.name) {
          // If the file already exists with the same name but a different size or type, generate a new file name
          file.name = `${Math.floor(Math.random() * 1000)}-${file.name}`;
        }
        // Generate a new file ID
        const checkExistingFile = async () => {
          const [fileId] = await Query.generateUUID();
          // Check if the file ID already exists in the database
          const [existingFile] = await File.getOneByField("id", fileId.uuid);
          if (!existingFile) {
            // If the file ID doesn't exist, create the file in the database
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
          // If the file ID already exists, generate a new one and check again
          return await checkExistingFile();
        };
        // Add the file to the database
        await checkExistingFile();
        // Get the destination where the file should be uploaded
        const destination = `${req.body.path}/${file.name}`;
        // Get the file content
        const fileContent = Buffer.from(file.data, "binary");
        // Upload the file
        await uploadFile(destination, file, fileContent);
      }
    });
    // Return a success message
    return res.json({ message: "Fichiers envoyés avec succès !" });
  } catch (error) {
    // Return an error message in case of a server error
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Delete one file by its ID
 * @param {string} file_id.body.required - ID of the file to delete
 * @param {string} path.body.required - Path of the file to delete
 * @returns {object} 200 - Success message
 * @returns {Error} 404 - File not found
 * @returns {Error} 500 - Server error
 */
const deleteOneFile = async (req, res) => {
  try {
    const [file] = await File.getOneByField("id", req.body.file_id);
    if (!file) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    const completePath = `${req.body.path}/${file.label}`;
    const existingFile = await checkExisting(completePath);

    // If the file exists in S3
    if (existingFile) {
      // Delete the file from S3
      await deleteFile(completePath);
    }
    // Delete the file from the database
    await File.deleteOne(file.id);
    return res.json({ message: "Fichier supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Delete many files and/or folders
 * @param {FileObject[]} files.body.required - Array of file objects to delete
 * @param {FolderObject[]} folders.body.required - Array of folder objects to delete
 * @param {string} path.body.required - Path of the files and/or folders
 * @returns {object} 200 - Success message
 * @returns {Error} 500 - Server error
 */
const deleteManyFiles = async (req, res) => {
  try {
    const { files, folders, path } = req.body;
    // If the array of files is not empty
    if (files.length > 0) {
      // Loop over each file
      files.map(async (file) => {
        // Create the complete file path
        const completeFilePath = `${req.body.path}/${file.label}`;
        // Get the file from the database
        const [existingFile] = await File.getOneByField("id", file.id);
        // Check if the file exists in S3
        const ExistingFileS3 = await checkExisting(completeFilePath);
        if (existingFile && ExistingFileS3) {
          // Delete the file from S3
          await deleteFile(completeFilePath);
          // Delete the file from the database
          await File.deleteOne(existingFile.id);
        }
      });
    }

    // If the array of folders is not empty
    if (folders.length > 0) {
      // Loop over each folder
      folders.map(async (folder) => {
        // Create the complete folder path
        const completeFolderPath = `${req.body.path}/${folder.id}/`;
        // Get the folder from the database
        const [existingFolder] = await Folder.getOneById(folder.id);
        // Check if the folder exists in S3
        const existingFolderS3 = await checkExisting(completeFolderPath);
        if (existingFolder || existingFolderS3) {
          // Delete the folder from S3
          await deleteFolder(completeFolderPath);
          // Delete the folder from the database
          await Folder.deleteOne(existingFolder.id);
        }
      });
    }
    // Return a success message
    return res.json({
      message: "Sélection des fichiers et/ou dossiers supprimé avec succès !",
    });
  } catch (error) {
    // Return an error message in case of a server error
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Download a file by its ID
 * @param {string} file_id.path.required - ID of the file to download
 * @param {string} path.path.required - Path of the file to download
 * @returns {File} 200 - The file
 * @returns {Error} 404 - File not found
 * @returns {Error} 500 - Server error
 */
const download = async (req, res) => {
  try {
    const [file] = await File.getOneByField("id", req.params.file_id);
    if (!file) {
      return res.status(404).json({ error: "Fichier introuvable" });
    }
    const path = `${req.params.path.replace("&&&", "/")}/${file.label}`;
    // Download the file from S3
    await downloadFile(path, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Get the total number of files in the database
 * @returns {integer} 200 - The total number of files
 * @returns {Error} 500 - Server error
 */
const getTotalFiles = async (req, res) => {
  try {
    const [totalFiles] = await File.total();
    return res.json(totalFiles);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getOne, add, deleteOneFile, deleteManyFiles, download, getTotalFiles };
