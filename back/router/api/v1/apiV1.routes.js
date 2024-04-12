import express from "express";
import { loggedOnly } from "../../middleware/middleware.js";
import fileRoutes from "./file.routes.js";
import folderRoutes from "./folder.routes.js";
import shareRoutes from "./share.routes.js";
import userRoutes from "./user.routes.js";

const apiV1Routes = express.Router();
//route prefix: /api/v1

apiV1Routes.use("/file", loggedOnly, fileRoutes);
apiV1Routes.use("/folder", loggedOnly, folderRoutes);
apiV1Routes.use("/user", loggedOnly, userRoutes);
apiV1Routes.use("/share", shareRoutes);

export default apiV1Routes;
