import express from "express";
import {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

// Route to get all categories
categoryRouter.get("/get-all-categories", getAllCategories);

categoryRouter.post("/add-category", addCategory);

categoryRouter.put("/update-category/:categoryId", updateCategory);

// Route to delete a category
categoryRouter.delete("/delete-category/:categoryId", deleteCategory);

export default categoryRouter;
