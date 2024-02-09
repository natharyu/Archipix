import express from "express";
import jwt from "jsonwebtoken";
import User from "../../../model/User.js";

const folderRoutes = express.Router();
//route prefix: /api/v1/folder

folderRoutes.get("/getRoot", async (req, res) => {
  const sessionToken = req.cookies["Session"];
  console.log(sessionToken);
  const data = jwt.verify(sessionToken, process.env.JWT_SECRET);
  const [user] = await User.getOneByField("id", data.id);
  console.log(user);
});
export default folderRoutes;
