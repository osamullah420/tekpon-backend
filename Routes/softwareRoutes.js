import express from "express";
import {
  getAllSoftware,
  getTopSoftwareByCategory,
  addSoftware,
  getAllSoftwareByCategoryWithPagination,
  deleteSoftware,
  updateSoftware,
  getAllSoftwaresAdmin,
} from "../Controllers/softwareController.js";

const softwareRouter = express.Router();

softwareRouter.post("/add-software", addSoftware);
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

softwareRouter.get("/get-all-softwares", getAllSoftware);
softwareRouter.get("/get-all-softwares-admin", getAllSoftwaresAdmin);

softwareRouter.put("/update-software/:id", updateSoftware);
softwareRouter.delete("/delete-software/:id", deleteSoftware);
export default softwareRouter;
