import express from "express";
import {
  getAllCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategoriesWithDescription,
} from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

// Route to get all categories
categoryRouter.get("/get-all-categories", getAllCategories);
categoryRouter.get("/get-category-by-id/:id", getCategoryById);
categoryRouter.get(
  "/get-all-categories-with-description",
  getAllCategoriesWithDescription
);

categoryRouter.post("/add-category", addCategory);

categoryRouter.put("/update-category/:categoryId", updateCategory);

// Route to delete a category
categoryRouter.delete("/delete-category/:categoryId", deleteCategory);

export default categoryRouter;
