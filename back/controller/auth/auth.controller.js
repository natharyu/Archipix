import emailjs from "@emailjs/nodejs";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Folder from "../../model/Folder.model.js";
import Query from "../../model/Query.model.js";
import User from "../../model/User.model.js";
import { createFolder } from "../../utils/S3.js";

/**
 * Registers a new user
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @returns {Object} The response with the result of the registration
 */
const register = async (req, res) => {
  try {
    // Destructure the request body
    const { email, password, username } = req.body;

    // Check if the email is already registered
    const [existingUser] = await User.getOneByField("email", email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
    }

    // Hash the password with a salt
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Generate an email verification token
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");

    // Recursive function to generate a unique UUID
    const checkExistingUUID = async () => {
      const [newUUID] = await Query.generateUUID();
      const [existingUUID] = await User.getOneByField("storage", newUUID.uuid);
      if (existingUUID) {
        checkExistingUUID();
      } else {
        return newUUID;
      }
    };

    // Generate a unique UUID
    const storage = await checkExistingUUID();

    // Insert the new user into the database
    const newUser = await User.create({
      storage: storage.uuid,
      username,
      email,
      password: hashedPassword,
      created_at: new Date(),
      email_verification_token: emailVerificationToken,
      is_verified: false,
    });

    // Insert the new folder for the user
    const newFolder = await Folder.create({
      id: storage.uuid,
      user_id: newUser.insertId,
      parent_id: null,
      label: username,
      created_at: new Date(),
    });

    // Check if the insertions were successful
    if (!newUser || !newFolder) {
      return res.status(409).json({ error: "Erreur lors de l'inscription." });
    }

    // Create the folder on the S3 bucket
    createFolder(storage.uuid);

    // Send an email to the user to verify their email
    const serviceID = process.env.EMAIL_JS_REGISTER_SERVICE_ID;
    const templateID = process.env.EMAIL_JS_REGISTER_TEMPLATE_ID;
    const userID = process.env.EMAIL_JS_REGISTER_USER_ID;
    const templateParams = {
      to_email: email,
      subject: "Vérification de l'adresse e-mail",
      message: `Vérification de votre adresse e-mail
        Bonjour,
        Merci de cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail afin de pouvoir vous connecter :
        ${process.env.CLIENT_APP_URL}/verification-email/${emailVerificationToken}
        Cordialement,
        Archipix`,
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, {
        publicKey: userID,
        privateKey: process.env.EMAIL_JS_REGISTER_PRIVATE_KEY,
      });
      return res.json({ message: "Inscription reussie, un email de verification vous a été envoyé !" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de l'envoi de l'email de vérification. Veuillez contacter l'administrateur." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};

/**
 * Logs in an existing user
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @returns {Object} The response with the result of the login
 */
const login = async (req, res) => {
  try {
    // Destructure the request body
    const { email, password, remember } = req.body;

    // Get the user from the database using their email
    const [user] = await User.getAllFields("email", email);

    // Check if the user exists and if their password is valid
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Erreur lors de la connexion." });
    }

    // Check if the user has verified their email
    if (!user.is_verified) {
      return res.status(401).json({ error: "Veuillez verifier votre adresse e-mail avant de vous connecter." });
    }

    // Create a new JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: "1h",
      }
    );

    // Create a new refresh token
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_REFRESH,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: remember === true ? "30d" : "1d",
      }
    );

    // Set the JWT and refresh token as cookies
    res.cookie("Session", token, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.cookie("Refresh", refreshToken, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: remember === true ? 1000 * 60 * 60 * 30 * 24 : 1000 * 60 * 60 * 24,
    });

    // Return the user's folder and name
    return res.json({
      message: "Connexion reussie.",
      folder: user.storage,
      folderName: user.username,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

/**
 * Logout user
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
const logout = (req, res) => {
  try {
    // Clear the JWT and refresh token cookies
    res.clearCookie("Session");
    res.clearCookie("Refresh");

    // Return an empty response
    res.end();
  } catch (error) {
    // Return an error if something went wrong
    res.status(500).json({
      error: "Erreur lors de la déconnexion",
    });
  }
};

/**
 * Refreshes the user's JWT and cookie
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
const refresh = (req, res) => {
  try {
    // Retrieve the JWT and refresh token cookies
    const { Session: sessionToken, Refresh: refreshToken } = req.cookies;
    // Check if the refresh token is missing
    if (!sessionToken && !refreshToken) {
      // Return a response indicating that the refresh token is missing
      return res.json({ isLoggedIn: false, role: null, message: "Refresh token manquant" });
    } else if (!sessionToken) {
      // Verify the refresh token and get the user's role
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, user) => {
        if (err) {
          // Return a response indicating that the refresh token is invalid
          return res.json({ isLoggedIn: false, role: null, message: "Token invalide" });
        }
        const [refreshUser] = await User.getOneByField("email", user.email);
        const role = refreshUser.role;
        // Create a new access token
        const token = jwt.sign({ id: user.id, email: user.email, role: role }, process.env.JWT_SECRET, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: "1h",
        });
        // Set the access token as a cookie
        res.cookie("Session", token, { sameSite: "lax", httpOnly: true, maxAge: 1000 * 60 * 15 });
        // Return a response indicating that the user has been refreshed
        return res.json({ isLoggedIn: true, role: role });
      });
    } else if (sessionToken && refreshToken) {
      // Verify the access token and the refresh token
      jwt.verify(sessionToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, user) => {
            if (err) {
              // Return a response indicating that the refresh token is invalid
              return res.json({ isLoggedIn: false, role: null, message: "Token invalide" });
            }
            const [refreshUser] = await User.getOneByField("email", user.email);
            const role = refreshUser.role;
            const token = jwt.sign({ id: user.id, email: user.email, role: role }, process.env.JWT_SECRET, {
              algorithm: "HS256",
              allowInsecureKeySizes: true,
              expiresIn: "1h",
            });
            res.cookie("Session", token, { sameSite: "lax", httpOnly: true, maxAge: 1000 * 60 * 15 });
            return res.json({ isLoggedIn: true, role: role });
          });
        }
        // Return a response indicating that the user has been refreshed
        return res.json({ isLoggedIn: true, role: user.role, email: user.email });
      });
    }
  } catch (error) {
    // Return an error if something went wrong
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

/**
 * Sends an email to reset the user's password
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
const resetPassword = async (req, res) => {
  const { email } = req.body; // The user's email

  // Retrieve the user
  const [user] = await User.getOneByField("email", email);
  // Check if the user exists
  if (!user) {
    // Return a response indicating that the email was sent successfully
    return res.json({ message: "Email de réinitialisation envoyé avec succès." });
  }

  // Create a new reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Set the reset token and its expiration date in the database
  await User.update(
    {
      reset_token: resetToken,
      reset_token_expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
    user.id
  );

  // Retrieve the email.js variables
  const serviceID = process.env.EMAIL_JS_REGISTER_SERVICE_ID;
  const templateID = process.env.EMAIL_JS_REGISTER_TEMPLATE_ID;
  const userID = process.env.EMAIL_JS_REGISTER_USER_ID;

  // Set up the email template
  const templateParams = {
    to_email: email,
    subject: "Réinitialisation du mot de passe",
    // The message contains a link to reset the user's password
    message: `${process.env.CLIENT_APP_URL}/nouveau-mot-de-passe/${resetToken}`,
  };

  try {
    // Send the email
    await emailjs.send(serviceID, templateID, templateParams, {
      publicKey: userID,
      privateKey: process.env.EMAIL_JS_REGISTER_PRIVATE_KEY,
    });
    // Return a response indicating that the email was sent successfully
    return res.json({ message: "Email de réinitialisation envoyé avec succès." });
  } catch (error) {
    // Return an error if something went wrong
    return res.status(500).json({ error: "Erreur lors de l'envoi de l'email de réinitialisation." });
  }
};

/**
 * Verify the reset password token and update the user's password
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
const resetPasswordVerify = async (req, res) => {
  try {
    const { token } = req.params; // The reset password token
    const { newPassword } = req.body; // The new password
    const [user] = await User.getOneByField("reset_token", token); // Retrieve the user
    if (!user) {
      // Check if the token is valid
      return res.status(400).json({ error: "Lien invalide ou expiré." }); // Return an error if the token is invalid
    }
    if (user.reset_token_expires < new Date()) {
      // Check if the token has expired
      return res.status(400).json({ error: "Lien expiré" }); // Return an error if the token has expired
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    await User.update(
      {
        // Update the user's password and remove the reset token and expiration date
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      },
      user.id
    );
    return res.json({ message: "Mot de passe réinitialisé avec succès." }); // Return a success message
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe." }); // Return an error if something went wrong
  }
};

/**
 * Verify the user's email address
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
const verifyEmail = async (req, res) => {
  const { token } = req.params; // The email verification token

  try {
    const [user] = await User.getOneByField("email_verification_token", token); // Retrieve the user
    if (!user) {
      // Check if the token is valid
      return res.status(400).json({ error: "Lien de vérification invalide." }); // Return an error if the token is invalid
    }
    await User.update(
      {
        // Update the user's email address and remove the verification token
        is_verified: true,
        email_verification_token: null,
      },
      user.id
    );
    return res.json({ message: "Adresse e-mail validée, veuillez-vous connecter." }); // Return a success message
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la vérification de l'e-mail." }); // Return an error if something went wrong
  }
};

export default {
  register,
  login,
  logout,
  refresh,
  resetPassword,
  resetPasswordVerify,
  verifyEmail,
};
