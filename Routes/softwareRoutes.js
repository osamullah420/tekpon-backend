import express from "express";
import {
  getTopSoftwareByCategory,
  addSoftware,
  getAllSoftwareByCategoryWithPagination,
} from "../Controllers/softwareController.js";
import upload from "../Middlewares/upload.js";

const softwareRouter = express.Router();

softwareRouter.post("/add-software", upload.single("imageUrl"), addSoftware);
//to get top 6 softwares by category
softwareRouter.get(
  "/:subcategoryId/get-top-software",
  getTopSoftwareByCategory
);
//to get all softwares with pagination by category (20 per page)
softwareRouter.get(
  "/:subcategoryId/get-all-softwares",
  getAllSoftwareByCategoryWithPagination
);

export default softwareRouter;
