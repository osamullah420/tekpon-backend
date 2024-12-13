import express, { Router } from "express";
import { searchItems } from "../Controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.get("/nav-search", searchItems);

export default searchRouter;
