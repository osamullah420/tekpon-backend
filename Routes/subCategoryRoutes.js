import express from "express";
import {
  getSubCategoriesByCategory,
  getAllSubCategories,
  getSubCategoryById,
  addSubCategory,
  getTopSubCategories,
  deleteSubCategory,
  updateSubCategory,
  getAllSubCategoriesWithDescription,
} from "../Controllers/subCategoryController.js";

const subCategoryRouter = express.Router();

// Route to get subcategories by category
subCategoryRouter.get(
  "/:categoryId/get-sub-categories",
  getSubCategoriesByCategory
);
subCategoryRouter.get("/get-sub-category-by-id/:id", getSubCategoryById);

//get subcategories with pagination (24 per page)
subCategoryRouter.get("/get-all-subcategories", getAllSubCategories);
subCategoryRouter.get(
  "/get-all-subcategories-with-description",
  getAllSubCategoriesWithDescription
);

subCategoryRouter.post("/add-subcategory", addSubCategory);

subCategoryRouter.get("/get-popular-subcategories", getTopSubCategories);

subCategoryRouter.delete(
  "/delete-subcategory/:subCategoryId",
  deleteSubCategory
);
subCategoryRouter.put("/update-subcategory/:subCategoryId", updateSubCategory);

export default subCategoryRouter;
