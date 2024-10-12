import express from "express";

import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import {
  onAddTodo,
  onFetchTodos,
  onMarkTodo,
} from "../Controllers/TodoController.js";

const router = express.Router();

router.post("/add", authenticateToken, CheckingUser, onAddTodo);

router.get("/", authenticateToken, CheckingUser, onFetchTodos);

router.patch("/mark/:id", onMarkTodo);

export default router;
