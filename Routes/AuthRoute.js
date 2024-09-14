import express from "express";
import {
  onAdminRegister,
  onLogin,
  onProfile,
} from "../Controllers/AuthController.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";

const router = express.Router();

router.post("/register", onAdminRegister);

router.post("/login", onLogin);

router.get("/profile", authenticateToken, CheckingUser, onProfile);

export default router;
