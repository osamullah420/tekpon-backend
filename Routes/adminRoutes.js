import express from "express";
import { login, register } from "../Controllers/adminController.js";

const adminRouter = express.Router();

// Login and Register routes
adminRouter.post("/login", login);
adminRouter.post("/register", register);

export default adminRouter;
