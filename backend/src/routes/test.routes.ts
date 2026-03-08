import express from "express";
import { startTest, submitTest, getMyReports, getAllReports, getTestById } from "../controllers/test.controller";
import { protect , isStudent, isTeacher } from "../middleware/auth";

const router = express.Router();

router.post("/start", protect , isStudent, startTest);
router.post("/submit",protect , isStudent, submitTest);

// New routes
router.get("/my-reports", protect, isStudent, getMyReports);
router.get("/teacher/reports", protect, isTeacher, getAllReports);
router.get("/:id", protect, getTestById);

export default router;
