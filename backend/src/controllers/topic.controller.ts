import { Request, Response } from "express";
import Topic from "../models/topic.model";
import MCQ from "../models/mcq.model";
import { generateMCQsFromLLM } from "../services/gemini.service";
// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const postTopic = async (req: Request, res: Response) => {
  try {
    const { title, description, numQuestions } = req.body;
    const createdBy = req.user.id; // FIXED: use id, not _id
    const topic = await Topic.create({ title, description, createdBy, numQuestions });

    // Generate MCQs using LLM
    const mcqs = await generateMCQsFromLLM(title, description, numQuestions);
    const mcqDocs = await MCQ.insertMany(
      mcqs.map((mcq: any) => ({ ...mcq, topic: topic._id }))
    );
    topic.mcqs = mcqDocs.map((m: any) => m._id);
    await topic.save();

    res.status(201).json({ topic, mcqs: mcqDocs });
  } catch (err) {
    res.status(500).json({ message: "Error posting topic", error: err });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find().populate("mcqs");
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: "Error fetching topics", error: err });
  }
};
