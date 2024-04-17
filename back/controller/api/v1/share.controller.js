import { checkExisting, getOneSignedUrl } from "../../../utils/S3.js";
import File from "../../../model/File.model.js";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import Share from "../../../model/Share.model.js";
import User from "../../../model/User.model.js";

/**
 * Share a file by creating a new share in the database
 * @param {Object} req - request object
 * @param {Object} req.body - request's body
 * @param {number} req.body.file_id - file's id
 * @param {number} req.body.user_id - user's id
 * @param {string[]} req.body.path - file's path
 * @param {number} req.body.expiration - share's expiration time in seconds
 * @param {Object} res - response object
 * @returns {string} share's link
 */
const shareFile = async (req, res) => {
  const { file_id, user_id, path, expiration } = req.body;
  const [file] = await File.getOneByField("id", file_id);
  if (!file) {
    return res.status(404).json({ error: "Fichier introuvable" });
  }
  const [user] = await User.getOneByField("id", user_id);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }
  const completePath = `${path.join("/")}/${file.label}`;
  const existingFile = await checkExisting(completePath);
  if (!existingFile) {
    return res.status(404).json({ error: "Fichier introuvable" });
  }

  const link = await getOneSignedUrl(completePath, expiration);
  const checkExistingUUID = async () => {
    const [shareId] = await Query.generateUUID();
    // Check if the share ID already exists in the database
    const [existingShare] = await Share.getOneById("id", shareId.uuid);
    if (!existingShare) {
      // If the share ID doesn't exist, create the file in the database
      await Share.create({
        id: shareId.uuid,
        file_id: file_id,
        folder_id: null,
        link: link,
        user_id: user_id,
        created_at: new Date(),
        expiration: new Date(Date.now() + expiration * 1000),
      });
      return shareId.uuid;
    }
    // If the share ID already exists, generate a new one and check again
    return await checkExistingUUID();
  };
  // Add the share to the database
  const share = await checkExistingUUID();

  const shareLink = `/share/file/${share}`;

  await Share.update({ url: `${process.env.CLIENT_APP_URL}${shareLink}` }, share);
  return res.status(200).json(shareLink);
};

/**
 * Share a folder by creating a new share in the database
 *
 * @param {Object} req - request object
 * @param {Object} req.body - request's body
 * @param {number} req.body.folder_id - folder's id
 * @param {number} req.body.user_id - user's id
 * @param {string[]} req.body.path - folder's path
 * @param {number} req.body.expiration - share's expiration time in seconds
 * @param {Object} res - response object
 * @returns {string} share's link
 */
const shareFolder = async (req, res) => {
  const { folder_id, user_id, path, expiration } = req.body;
  const [folder] = await Folder.getOneById(folder_id);
  if (!folder) {
    return res.status(404).json({ error: "Dossier introuvable" });
  }
  const [user] = await User.getOneByField("id", user_id);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }
  const completePath = `${path.join("/")}/${folder.id}/`;
  const existingFile = await checkExisting(completePath);
  if (!existingFile) {
    return res.status(404).json({ error: "Fichier introuvable" });
  }
  const checkExistingUUID = async () => {
    const [shareId] = await Query.generateUUID();
    // Check if the share ID already exists in the database
    const [existingShare] = await Share.getOneById("id", shareId.uuid);
    if (!existingShare) {
      // If the share ID doesn't exist, create the file in the database
      await Share.create({
        id: shareId.uuid,
        file_id: null,
        folder_id: folder_id,
        link: completePath.substring(0, completePath.length - 1),
        user_id: user_id,
        created_at: new Date(),
        expiration: new Date(Date.now() + expiration * 1000),
      });
      return shareId.uuid;
    }
    // If the share ID already exists, generate a new one and check again
    return await checkExistingUUID();
  };
  // Add the share to the database
  const share = await checkExistingUUID();

  const shareLink = `/share/folder/${share}`;

  await Share.update({ url: `${process.env.CLIENT_APP_URL}${shareLink}` }, share);

  return res.status(200).json(shareLink);
};

/**
 * Verify if a share link is valid
 * @param {Object} req - request object
 * @param {string} req.params.id - share id
 * @param {Object} res - response object
 * @returns {Object} share link is valid or not and link or error message
 */
const verifyLink = async (req, res) => {
  try {
    const { id } = req.params;
    // Get the share from the database with the given id
    const [share] = await Share.getOneById(id);
    // If the share doesn't exist, return error
    if (!share) {
      return res.status(404).json({ valid: false, message: "Lien invalide" });
    }
    // If the share is expired, return error
    else if (share.expiration < new Date()) {
      return res.status(400).json({ valid: false, message: "Lien expiré" });
    }
    // If the share is valid, return the link and file id
    return res.status(200).json({ valid: true, link: share.link, file_id: share.file_id });
  } catch (error) {
    // If there is an error, return internal server error
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Delete a share
 * @param {Object} req - request object
 * @param {string} req.params.id - share id
 * @param {Object} res - response object
 * @returns {Object} success message
 */
const deleteOne = async (req, res) => {
  const { id } = req.params;
  // Get the share from the database with the given id
  const [share] = await Share.getOneById(id);
  // If the share doesn't exist, return error
  if (!share) {
    return res.status(404).json({ error: "Lien introuvable" });
  }
  // Delete the share from the database
  await Share.deleteOne(id);
  // Return success message
  return res.status(200).json({ message: "Lien supprimé avec succès !" });
};

export default { shareFile, shareFolder, verifyLink, deleteOne };
