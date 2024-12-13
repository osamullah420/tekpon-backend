import express from "express";
import softwareRouter from "./softwareRoutes.js";
import subCategoryRouter from "./subCategoryRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import searchRouter from "./searchRoutes.js";

const router = express.Router();

router.use("/api/v1/software", softwareRouter);
router.use("/api/v1/sub-category", subCategoryRouter);
router.use("/api/v1/category", categoryRouter);
router.use("/api/v1/search", searchRouter);

export default router;
