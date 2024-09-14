import express from "express";
import {
  onFetchExamDetails,
  onSubmittedData,
} from "../Controllers/ExamController.js";

const router = express.Router();

router.post("/fetch-examDetails", onFetchExamDetails);

router.post("/submit", onSubmittedData);

export default router;
