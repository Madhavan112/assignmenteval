import { Router } from "express";
import multer from "multer";
import {
  createAssignment,
  getMyAssignments,
  listAssignments,
  submitAssignment,
  getAssignmentSubmissions,
} from "../controllers/assignment.controller";
import { protect, authorizeRoles } from "../middleware/auth";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Teacher routes
router.post("/", protect, authorizeRoles("teacher"), createAssignment);
router.get("/my", protect, authorizeRoles("teacher"), getMyAssignments);
router.get("/:id/submissions", protect, authorizeRoles("teacher"), getAssignmentSubmissions);

// Student routes
router.get("/", protect, listAssignments);
router.post("/:id/submit", protect, authorizeRoles("student"), upload.single("pdf"), submitAssignment);

export default router;
