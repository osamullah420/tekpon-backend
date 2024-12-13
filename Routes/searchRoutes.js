import express, { Router } from "express";
import {
  searchItems,
  searchSoftwareByName,
} from "../Controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/nav-search", searchItems);
searchRouter.get("/banner-search", searchSoftwareByName);

export default searchRouter;
