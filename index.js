import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./Config/dbConfig.js";
import router from "./Routes/indexRoutes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

//connecting db
connectDB();

app.use(router);

const port = process.env.PORT;

//server connection

app.get("/", (req, res) => {
  res.send(`I am running on ${port}`);
});

//CLOUDINARY
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.listen(port, () => {
  console.log(`Server runnning only on  ${port}`);
});
