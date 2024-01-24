import express from "express";
import apiV1Routes from "./v1/apiV1.routes.js";

const apiRoutes = express.Router();

apiRoutes.use("/v1", apiV1Routes);

export default apiRoutes;
