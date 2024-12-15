import express from "express";
import {
  getSubCategoriesByCategory,
  getAllSubCategories,
  addSubCategory,
  getTopSubCategories,
  deleteSubCategory,
  updateSubCategory,
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

subCategoryRouter.get("/get-popular-subcategories", getTopSubCategories);

subCategoryRouter.delete(
  "/delete-subcategory/:subCategoryId",
  deleteSubCategory
);
subCategoryRouter.put("/update-subcategory/:subCategoryId", updateSubCategory);

export default subCategoryRouter;
