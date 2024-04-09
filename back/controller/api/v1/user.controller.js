import bcrypt from "bcryptjs";
import { createFolder, deleteFolder } from "../../../config/S3.js";
import File from "../../../model/File.model.js";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";

const getUserInfo = async (req, res) => {
  try {
    const [user] = await User.getOneByField("email", req.params.email);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    const [totalSize] = await File.getTotalSize(user.id);
    const [totalFiles] = await File.countTotal(user.id);
    return res.json({ user: user, totalSize: totalSize.totalSize, totalFiles: totalFiles.totalFiles });
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getOne = async (req, res) => {
  try {
    const [user] = await User.getOneByField("id", req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.getAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    const [totalUsers] = await User.total();
    return res.json(totalUsers);
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const deleteOneUser = async (req, res) => {
  try {
    const [user] = await User.getOneByField("id", req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    await deleteFolder(user.storage);
    await User.deleteOne(user.id);
    return res.json({ message: "Utilisateur supprimé avec succès !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const update = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.json({ message: "Utilisateur mis à jour avec succès !" });
    }
    const [user] = await User.getOneByField("id", req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    await User.update(req.body, req.params.id);
    return res.json({ message: "Utilisateur mis à jour avec succès !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const adminAddUser = async (req, res) => {
  try {
    const email = req.body.email || null;
    const password = req.body.password || null;
    const username = req.body.username || null;
    const firstname = req.body.firstname || null;
    const lastname = req.body.lastname || null;
    const role = req.body.role || null;
    const is_verified = req.body.is_verified || null;
    const [existingUser] = await User.getOneByField("email", email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
    }
    const passwordHash = bcrypt.hashSync(password, 10);

    const checkExistingUUID = async () => {
      const [newUUID] = await Query.generateUUID();
      const [existingUUID] = await User.getOneByField("storage", newUUID.uuid);
      if (existingUUID) {
        checkExistingUUID();
      } else {
        return newUUID;
      }
    };
    const storage = await checkExistingUUID();
    const newUser = await User.createByAdmin({
      storage: storage.uuid,
      username,
      email,
      password: passwordHash,
      created_at: new Date(),
      firstname,
      lastname,
      role,
      is_verified,
    });
    const newFolder = await Folder.create({
      id: storage.uuid,
      user_id: newUser.insertId,
      parent_id: null,
      label: username,
      created_at: new Date(),
    });

    await createFolder(storage.uuid);

    if (!newUser || !newFolder) {
      return res.status(409).json({ error: "Erreur lors de l'inscription." });
    }

    return res.json({ message: "Utilisateur ajouté avec succès !" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { getUserInfo, getOne, getTotalUsers, getAll, deleteOneUser, update, adminAddUser };
