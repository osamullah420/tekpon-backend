import express, { Router } from "express";
import {
  searchItems,
  searchSoftwareByName,
  searchSubCategories,
  getSortedSubCategories,
} from "../Controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/nav-search", searchItems);
searchRouter.get("/banner-search", searchSoftwareByName);
searchRouter.get("/categ-search", searchSubCategories);
searchRouter.get("/sort-sub-categories", getSortedSubCategories);

export default searchRouter;
