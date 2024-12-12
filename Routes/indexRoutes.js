import express from "express";
import softwareRouter from "./softwareRoutes.js";
import subCategoryRouter from "./subCategoryRoutes.js";

const router = express.Router();

router.use("/api/v1/software", softwareRouter);
router.use("/api/v1/sub-category", subCategoryRouter);

export default router;
