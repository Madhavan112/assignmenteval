import express from "express";
import { postTopic, getTopics } from "../controllers/topic.controller";
import { protect, isTeacher } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, isTeacher, postTopic);
router.get("/", getTopics);


export default router;
