import express from "express";
import { login, register } from "../Controllers/adminController.js";

const router = express.Router();

// Login and Register routes
router.post("/login", login);
router.post("/register", register);

export default router;
