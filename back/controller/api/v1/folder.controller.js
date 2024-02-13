import Folder from "../../../model/Folder.model.js";

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

export default { get, getPath };
