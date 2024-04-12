import { checkExisting, getOneSignedUrl } from "../../../config/S3.js";
import File from "../../../model/File.model.js";
import Folder from "../../../model/Folder.model.js";
import Share from "../../../model/Share.model.js";
import User from "../../../model/User.model.js";

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
  const share = await Share.create({
    file_id: file_id,
    folder_id: null,
    link: link,
    user_id: user_id,
    created_at: new Date(),
    expiration: new Date(Date.now() + expiration * 1000),
  });
  const shareLink = `/share/file/${share.insertId}`;

  await Share.update({ url: `https://archipix.dew-hub.ovh${shareLink}` }, share.insertId);
  return res.status(200).json(shareLink);
};

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
  const share = await Share.create({
    file_id: null,
    folder_id: folder_id,
    link: completePath.substring(0, completePath.length - 1),
    user_id: user_id,
    created_at: new Date(),
    expiration: new Date(Date.now() + expiration * 1000),
  });
  const shareLink = `/share/folder/${share.insertId}`;

  await Share.update({ url: `https://archipix.dew-hub.ovh${shareLink}` }, share.insertId);

  return res.status(200).json(shareLink);
};

const verifyLink = async (req, res) => {
  try {
    const { id } = req.params;
    const [share] = await Share.getOneById(id);
    if (!share) {
      return res.status(404).json({ valid: false, message: "Lien invalide" });
    } else if (share.expiration < new Date()) {
      return res.status(400).json({ valid: false, message: "Lien expiré" });
    }
    return res.status(200).json({ valid: true, link: share.link, file_id: share.file_id });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const [share] = await Share.getOneById(id);
  if (!share) {
    return res.status(404).json({ error: "Lien introuvable" });
  }
  await Share.deleteOne(id);
  return res.status(200).json({ message: "Lien supprimé avec succès !" });
};
export default { shareFile, shareFolder, verifyLink, deleteOne };
