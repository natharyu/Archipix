import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import router from "./router/router.js";

const app = express();
configDotenv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: `${process.env.CLIENT_APP_URL}`, credentials: true }));
app.use(cookieParser());

app.use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port ${process.env.SERVER_PORT}`);
});
