import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import router from "./router/router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({ origin: `${process.env.CLIENT_APP_URL}`, methods: ["GET", "POST", "PATCH", "DELETE"], credentials: true })
);
app.use(cookieParser());
app.use(express.static("views/dist"));
app.use("/assets", express.static("views/src/assets"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads/tmp/",
  })
);
app.use("/uploads", express.static("uploads"));

app.use(router);
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port ${process.env.SERVER_PORT}`);
});
