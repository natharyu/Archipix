import jwt from "jsonwebtoken";
import { checkExisting, createFolder, deleteFolder, makeArchive } from "../../../config/S3.js";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";
/**
 * Get folders by parent id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object with the folders
 */
const get = async (req, res) => {
  try {
    const folders = await Folder.getByField("parent_id", req.params.parent_id);
    return res.json(folders);
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur est survenue",
    });
  }
};

/**
 * Get the path of a folder
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Object} - The response object with the path
 */
const getPath = async (req, res) => {
  try {
    const path = []; // The path of the folder
    const pathName = []; // The name of the folders in the path
    /**
     * Recursive function to build the path
     *
     * @param {string} folder_id - The id of the folder
     */
    const buildPath = async (folder_id) => {
      const [folder] = await Folder.getOneById(folder_id); // Get the folder
      if (folder.parent_id !== null) {
        // If the folder has a parent
        path.push(folder.id); // Add the folder id to the path
        pathName.push(folder.label); // Add the folder name to the pathName
        await buildPath(folder.parent_id); // Recursively call the function with the parent id
      } else {
        // If the folder has no parent
        path.push(folder.id); // Add the folder id to the path
        pathName.push(folder.label); // Add the folder name to the pathName
      }
    };
    await buildPath(req.params.folder_id); // Call the function with the folder id
    return res.json({ path: path.reverse(), pathName: pathName.reverse() }); // Return the path and pathName reversed
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" }); // Return an error if an error is thrown
  }
};

/**
 * Get the root folder of a user
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @returns {Object} - The response object with the root folder
 */
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

/**
 * Asynchronously creates a new folder based on the request data
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @return {Promise} A promise that resolves to the JSON response indicating the success or failure of the folder creation
 */
const create = async (req, res) => {
  try {
    // Verify the session token and get the user
    const sessionToken = req.cookies["Session"];
    const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
    const [user] = await User.getOneByField("id", data.id);

    // Generate a new UUID for the folder
    const [newFolderId] = await Query.generateUUID();

    try {
      // Check if the folder already exists
      const existingFolder = await checkExisting(newFolderId.uuid);
      if (!existingFolder) {
        // If the folder doesn't exist, create it
        const newFolder = await Folder.create({
          id: newFolderId.uuid,
          user_id: user.id,
          parent_id: req.body.currentFolder,
          label: req.body.newFolderName,
          created_at: new Date(),
        });

        const completePath = `${req.body.path}/${newFolderId.uuid}`;
        await createFolder(completePath);

        if (!newFolder) {
          // If the folder wasn't created successfully, return an error
          return res.status(409).json({ error: "Erreur lors de la création du dossier" });
        }
      }
    } catch (err) {
      console.error(err);
    }

    // If the folder was created successfully, return a success message
    return res.json({ message: "Dossier créé avec succes" });
  } catch (error) {
    // If an error was thrown, return an error message
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Asynchronously deletes a folder based on the request data
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @return {Promise} A promise that resolves to the JSON response indicating the success or failure of the folder deletion
 */
const deleteOneFolder = async (req, res) => {
  try {
    // Get the folder to be deleted
    const [folder] = await Folder.getOneById(req.body.folder_id);
    // If the folder doesn't exist, return an error
    if (!folder) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }
    // Get the complete path of the folder to be deleted
    const completePath = `${req.body.path}/${folder.id}/`;
    // Delete the folder from the file system
    await deleteFolder(completePath);
    // Delete the folder from the database
    await Folder.deleteOne(folder.id);
    // If the folder was deleted successfully, return a success message
    return res.json({ message: "Dossier supprimé avec succès !" });
    // If an error was thrown, return an error message
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Asynchronously downloads a folder based on the request parameters
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 *
 * @return {Promise} A promise that resolves to the download of the folder
 */
const download = async (req, res) => {
  try {
    // Get the folder to be downloaded
    const [folder] = await Folder.getOneById(req.params.folder_id);
    // If the folder doesn't exist, return an error
    if (!folder) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }
    // Get the complete path of the folder to be downloaded
    const path = `${req.params.path.replace("&&&", "/")}/${folder.id}/`;

    // Download the folder as a .zip file
    await makeArchive(path, res, folder.id);
    // End the response to signal the download is complete
    res.end();
  } catch (error) {
    // If an error was thrown, return an error message
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { get, getPath, getRoot, create, deleteOneFolder, download };
