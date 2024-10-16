import express from "express";

import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { onFetchStudentMaterials } from "../Controllers/StudentController.js";

const router = express.Router();

router.get("/materials/:courseName", onFetchStudentMaterials);

export default router;
