import express from "express";
import {
  getSubCategoriesByCategory,
  getAllSubCategories,
  addSubCategory,
} from "../Controllers/subCategoryController.js";

const subCategoryRouter = express.Router();

// Route to get subcategories by category
subCategoryRouter.get(
  "/:categoryId/get-sub-categories",
  getSubCategoriesByCategory
);

//get subcategories with pagination (24 per page)
subCategoryRouter.get("/get-all-subcategories", getAllSubCategories);

subCategoryRouter.post("/add-subcategory", addSubCategory);

export default subCategoryRouter;
