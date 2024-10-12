import express from "express";

import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import {
  onFetchFeedback,
  onPostFeedback,
} from "../Controllers/FeedBackController.js";

const router = express.Router();

router.get("/:examId", onFetchFeedback);

router.post("/added", onPostFeedback);

export default router;
