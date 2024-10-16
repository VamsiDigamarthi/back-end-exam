import express from "express";

import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { onFetchAllQuizes } from "../Controllers/QuizeController.js";

const router = express.Router();

router.get("/all-quize/:courseName", onFetchAllQuizes);

export default router;
