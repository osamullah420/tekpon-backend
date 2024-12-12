import express from "express";
import {
  getTopSoftwareByCategory,
  addSoftware,
} from "../Controllers/softwareController.js";
import upload from "../Middlewares/upload.js";

const softwareRouter = express.Router();

softwareRouter.post("/software", upload.single("image"), addSoftware);
softwareRouter.get("/:categoryId/top-software", getTopSoftwareByCategory);

export default softwareRouter;
