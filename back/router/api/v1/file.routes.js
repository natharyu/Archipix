import express from "express";

const fileRoutes = express.Router();
//route prefix: /api/v1/file

fileRoutes.get("/get", (req, res) => {
  res.json(["Hello World!"]);
});
export default fileRoutes;
