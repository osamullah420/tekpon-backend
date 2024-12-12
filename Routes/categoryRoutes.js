import express from "express";
import { getAllCategories } from "../Controllers/categoryController.js";

const categoryRouter = express.Router();

// Route to get all categories
categoryRouter.get("/get-all-categories", getAllCategories);

export default categoryRouter;
