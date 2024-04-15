import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import router from "./router/router.js";

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: `${process.env.CLIENT_APP_URL}`,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("views"));
app.use(fileUpload());

app.use(router);

app.listen(port, (err, res) => {
  if (err) {
    return res.status(500).send(err.message);
  } else {
    console.log("Server Running on port:", port);
  }
});
