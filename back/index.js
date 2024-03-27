import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import router from "./router/router.js";

const app = express();
const port = process.env.PORT || 3000;

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

app.get("/", (req, res) => {
  res.send("Express JS on Vercel");
});
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

app.listen(port, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on port:", port);
  }
});
