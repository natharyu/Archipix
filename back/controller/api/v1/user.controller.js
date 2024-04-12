import bcrypt from "bcryptjs";
import { createFolder, deleteFolder } from "../../../config/S3.js";
import File from "../../../model/File.model.js";
import Folder from "../../../model/Folder.model.js";
import Query from "../../../model/Query.model.js";
import User from "../../../model/User.model.js";

/**
 * Retrieves user information based on the provided email in the request params.
 * Returns the user information, total size and total number of files.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} JSON object containing user information, total size and total number of files, or an error message
 */
const getUserInfo = async (req, res) => {
  try {
    // get user based on email
    const [user] = await User.getOneByField("email", req.params.email);

    // if user not found, return 404
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // get total size and total number of files for the user
    const [totalSize] = await File.getTotalSize(user.id);
    const [totalFiles] = await File.countTotal(user.id);

    // return user information, total size and total number of files
    return res.json({ user: user, totalSize: totalSize.totalSize, totalFiles: totalFiles.totalFiles });
  } catch (error) {
    // return 500 error if something goes wrong
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Retrieves a user based on the provided id in the request params.
 * Returns the user information if found, otherwise returns a 404 error.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} JSON object containing the user information or a 404 error
 */
const getOne = async (req, res) => {
  try {
    // get user based on id
    const [user] = await User.getOneByField("id", req.params.id);

    // if user not found, return 404
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // return user information
    return res.json(user);
  } catch (error) {
    // return 500 error if something goes wrong
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Retrieves all users.
 * Returns a JSON array of user objects.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Array} JSON array of user objects
 */
const getAll = async (req, res) => {
  try {
    // get all users
    const users = await User.getAll();
    // return users
    return res.json(users);
  } catch (error) {
    // return 500 error if something goes wrong
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Retrieve the total number of users.
 *
 * This function retrieves the total number of users from the database and returns it as a JSON response.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Object} the total number of users as a JSON response
 */
const getTotalUsers = async (req, res) => {
  try {
    // retrieve total number of users from database
    const [totalUsers] = await User.total();
    // send total number of users as a JSON response
    return res.json(totalUsers);
  } catch (error) {
    // return 500 error if something goes wrong
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Delete one user from the database and its associated storage
 *
 * This function retrieves the user to delete from the database, deletes its storage and then deletes
 * the user from the database. It returns a JSON message with the deletion result.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} JSON message with the deletion result
 */
const deleteOneUser = async (req, res) => {
  try {
    // get user based on id
    const [user] = await User.getOneByField("id", req.params.id);
    // if user not found, return 404
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    // delete storage associated with user
    await deleteFolder(user.storage);
    // delete user from database
    await User.deleteOne(user.id);
    // return success message
    return res.json({ message: "Utilisateur supprimé avec succès !" });
  } catch (error) {
    // log error and return 500 error
    console.error(error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Update an existing user in the database
 *
 * This function retrieves the user to update from the database, updates it according to the request
 * body and then saves the updated user to the database. If the request body is empty, the function
 * returns a success message without updating the user.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} JSON message with the update result
 */
const update = async (req, res) => {
  try {
    // If the request body is empty, send success message without updating user
    if (Object.keys(req.body).length === 0) {
      return res.json({ message: "Utilisateur mis à jour avec succès !" });
    }

    // Get user to update from database
    const [user] = await User.getOneByField("id", req.params.id);

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // If password is given, hash it
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    // Update user in database
    await User.update(req.body, req.params.id);

    // Return success message
    return res.json({ message: "Utilisateur mis à jour avec succès !" });
  } catch (error) {
    // return 500 error
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Create a new user in the database as an admin
 *
 * This function creates a new user in the database based on the request body,
 * but without verifying the email address. The function returns a JSON message
 * with the creation result.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} JSON message with the creation result
 */
const adminAddUser = async (req, res) => {
  try {
    // Retrieve user data from request body
    const email = req.body.email || null;
    const password = req.body.password || null;
    const username = req.body.username || null;
    const firstname = req.body.firstname || null;
    const lastname = req.body.lastname || null;
    const role = req.body.role || null;
    const is_verified = req.body.is_verified || null;

    // Check if the email is already used
    const [existingUser] = await User.getOneByField("email", email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
    }

    // Hash the password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Generate a new UUID
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

    // Create the new user in the database
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

    // Create the new user folder
    const newFolder = await Folder.create({
      id: storage.uuid,
      user_id: newUser.insertId,
      parent_id: null,
      label: username,
      created_at: new Date(),
    });

    // Create the base folder structure
    await createFolder(storage.uuid);

    // If user or folder not created, return error
    if (!newUser || !newFolder) {
      return res.status(409).json({ error: "Erreur lors de l'inscription." });
    }

    // Return success message
    return res.json({ message: "Utilisateur ajouté avec succès !" });
  } catch (error) {
    // return 500 error
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

export default { getUserInfo, getOne, getTotalUsers, getAll, deleteOneUser, update, adminAddUser };
