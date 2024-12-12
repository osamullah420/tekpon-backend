import express from "express";
import {
  getSubCategoriesByCategory,
  getAllSubCategories,
} from "../Controllers/subCategoryController.js";

const subCategoryRouter = express.Router();

// Route to get subcategories by category (only 6 first)
subCategoryRouter.get(
  "/:categoryId/get-sub-categories",
  getSubCategoriesByCategory
);

//get subcategories with pagination (24 per page)
subCategoryRouter.get("/subcategories", getAllSubCategories);

export default subCategoryRouter;
