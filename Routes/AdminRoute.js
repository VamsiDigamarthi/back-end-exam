import express from "express";
import {
  onAddExams,
  onAddQuestion,
  onAddStudent,
  onFetchAllBatchWiseStudent,
  onFetchAllExamSections,
  onFetchAllResults,
} from "../Controllers/AdminController.js";

const router = express.Router();

router.post("/add-student", onAddStudent);

router.post("/add-question", onAddQuestion);

router.post("/add-exams", onAddExams);

router.get("/batch-wise-student", onFetchAllBatchWiseStudent);

router.get("/all-exam-sections", onFetchAllExamSections);

// all- exam details

router.get("/all-results", onFetchAllResults);

export default router;
