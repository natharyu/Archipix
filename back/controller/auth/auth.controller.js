import emailjs from "@emailjs/nodejs";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import jwt from "jsonwebtoken";
import Folder from "../../model/Folder.model.js";
import Query from "../../model/Query.model.js";
import User from "../../model/User.model.js";

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const [existingUser] = await User.getOneByField("email", email);
    if (existingUser) {
      return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");
    const [storage] = await Query.generateUUID();
    const newUser = await User.create({
      storage: storage.uuid,
      username,
      email,
      password: hashedPassword,
      created_at: new Date(),
      email_verification_token: emailVerificationToken,
      is_verified: false,
    });

    const newFolder = await Folder.create({
      id: storage.uuid,
      user_id: newUser.insertId,
      parent_id: null,
      label: username,
      created_at: new Date(),
    });

    if (!newUser || !newFolder) {
      return res.status(409).json({ error: "Erreur lors de l'inscription." });
    }

    try {
      if (!fs.existsSync(`./uploads/${storage.uuid}`)) {
        fs.mkdirSync(`./uploads/${storage.uuid}`);
        fs.mkdirSync(`./uploads/${storage.uuid}/tmp`);
      }
    } catch (err) {
      console.error(err);
    }

    const serviceID = process.env.EMAIL_JS_REGISTER_SERVICE_ID;
    const templateID = process.env.EMAIL_JS_REGISTER_TEMPLATE_ID;
    const userID = process.env.EMAIL_JS_REGISTER_USER_ID;
    const templateParams = {
      to_email: email,
      subject: "Vérification de l'adresse e-mail",
      message: `http://localhost:5173/verification-email/${emailVerificationToken}`,
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

const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    const [user] = await User.getOneByField("email", email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Erreur lors de la connexion." });
    }
    if (!user.is_verified) {
      return res.status(401).json({ error: "Veuillez verifier votre adresse e-mail avant de vous connecter." });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_REFRESH, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: remember === true ? "30d" : "1d",
    });
    res.cookie("Session", token, { sameSite: "lax", httpOnly: true, maxAge: 1000 * 60 * 15 });
    res.cookie("Refresh", refreshToken, {
      sameSite: "lax",
      httpOnly: true,
      maxAge: remember === true ? 1000 * 60 * 60 * 30 * 24 : 1000 * 60 * 60 * 24,
    });

    return res.json({ message: "Connexion reussie.", folder: user.storage, folderName: user.username });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("Session");
    res.clearCookie("Refresh");
    res.end();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la déconnexion" });
  }
};

const refresh = (req, res) => {
  try {
    const { Session: sessionToken, Refresh: refreshToken } = req.cookies;
    if (!sessionToken && !refreshToken) {
      return res.json({ isLoggedIn: false, role: null, message: "Refresh token manquant" });
    } else if (!sessionToken) {
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, user) => {
        if (err) {
          return res.json({ isLoggedIn: false, role: null, message: "Token invalide" });
        }
        const [refreshUser] = await User.getOneByField("email", user.email);
        const role = refreshUser.role;
        const token = jwt.sign({ id: user.id, email: user.email, role: role }, process.env.JWT_SECRET, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: "15m",
        });
        res.cookie("Session", token, { sameSite: "lax", httpOnly: true, maxAge: 1000 * 60 * 15 });
        return res.json({ isLoggedIn: true, role: role });
      });
    } else if (sessionToken && refreshToken) {
      jwt.verify(sessionToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, async (err, user) => {
            if (err) {
              return res.json({ isLoggedIn: false, role: null, message: "Token invalide" });
            }
            const [refreshUser] = await User.getOneByField("email", user.email);
            const role = refreshUser.role;
            const token = jwt.sign({ id: user.id, email: user.email, role: role }, process.env.JWT_SECRET, {
              algorithm: "HS256",
              allowInsecureKeySizes: true,
              expiresIn: "15m",
            });
            res.cookie("Session", token, { sameSite: "lax", httpOnly: true, maxAge: 1000 * 60 * 15 });
            return res.json({ isLoggedIn: true, role: role });
          });
        }
        return res.json({ isLoggedIn: true, role: user.role });
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  const [user] = await User.getOneByField("email", email);
  if (!user) {
    return res.json({ message: "Email de réinitialisation envoyé avec succès." });
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  await User.update(
    {
      reset_token: resetToken,
      reset_token_expires: new Date(Date.now() + 60 * 60 * 1000),
    },
    user.id
  );

  const serviceID = process.env.EMAIL_JS_REGISTER_SERVICE_ID;
  const templateID = process.env.EMAIL_JS_REGISTER_TEMPLATE_ID;
  const userID = process.env.EMAIL_JS_REGISTER_USER_ID;

  const templateParams = {
    to_email: email,
    subject: "Réinitialisation du mot de passe",
    message: `http://localhost:5173/nouveau-mot-de-passe/${resetToken}`,
  };

  try {
    await emailjs.send(serviceID, templateID, templateParams, {
      publicKey: userID,
      privateKey: process.env.EMAIL_JS_REGISTER_PRIVATE_KEY,
    });
    return res.json({ message: "Email de réinitialisation envoyé avec succès." });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'envoi de l'email de réinitialisation." });
  }
};

const resetPasswordVerify = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const [user] = await User.getOneByField("reset_token", token);
    if (!user) {
      return res.status(400).json({ error: "Lien invalide ou expiré." });
    }
    if (user.reset_token_expires < new Date()) {
      return res.status(400).json({ error: "Lien expiré" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword, reset_token: null, reset_token_expires: null }, user.id);
    return res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe." });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const [user] = await User.getOneByField("email_verification_token", token);
    if (!user) {
      return res.status(400).json({ error: "Lien de vérification invalide." });
    }
    await User.update({ is_verified: true, email_verification_token: null }, user.id);
    return res.json({ message: "Adresse e-mail validée, veuillez-vous connecter." });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la vérification de l'e-mail." });
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
