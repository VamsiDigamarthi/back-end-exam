import express from "express";
import {
  onAddExams,
  onAddFeedBacks,
  onAddMaterials,
  onAddQuestion,
  onAddStudent,
  onFecthStudentFeedbacks,
  onFetchAllBatchWiseStudent,
  onFetchAllCourseDetails,
  onFetchAllExamSections,
  onFetchAllResults,
  onFetchMaterials,
} from "../Controllers/AdminController.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import upload from "../Middlewares/fileUploadmiddleware.js";

const router = express.Router();

router.post("/add-student", onAddStudent);

router.post("/add-question", onAddQuestion);

router.post("/add-exams", onAddExams);

router.get("/batch-wise-student", onFetchAllBatchWiseStudent);

router.get("/all-exam-sections", onFetchAllExamSections);

// all- exam details

router.get("/all-results", onFetchAllResults);

// add feedbacks
router.post("/feed-backs", authenticateToken, CheckingUser, onAddFeedBacks);

router.get(
  "/all-student-feedback",
  // authenticateToken,
  // CheckingUser,
  onFecthStudentFeedbacks
);

// all course details

router.get("/all-course", onFetchAllCourseDetails);

router.post("/meterials", upload.single("pdf"), onAddMaterials);

router.get("/fetch-materials", onFetchMaterials);

export default router;
