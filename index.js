import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./Config/dbConfig.js";
import router from "./Routes/indexRoutes.js";
import cors from "cors";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

//connecting db
connectDB();

app.use(router);

const port = process.env.PORT;

//server connection

app.get("/", (req, res) => {
	res.send(`I am running on ${port}`);
});
app.listen(port, () => {
	console.log(`Server runnning only on  ${port}`);
});
