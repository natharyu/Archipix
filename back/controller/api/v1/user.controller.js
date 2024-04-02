import File from "../../../model/File.model.js";
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

export default { getUserInfo, getTotalUsers, getAll };
