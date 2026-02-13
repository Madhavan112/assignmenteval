import { Request, Response } from "express";
import MCQ from "../models/mcq.model";
import Topic from "../models/topic.model";
import Test from "../models/test.model";
import { analyzeTestPerformance } from "../services/gemini.service";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const startTest = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.body;
    const studentId = req.user.id;
    const topic = await Topic.findById(topicId).populate("mcqs");
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const test = await Test.create({
      student: studentId,
      topic: topicId,
      mcqs: topic.mcqs,
      answers: [],
      score: 0,
      completed: false,
    });
    const populatedTest = await Test.findById(test._id)
      .populate("mcqs")
      .populate("topic");
    res.status(201).json({ test: populatedTest });
  } catch (err) {
    res.status(500).json({ message: "Error starting test", error: err });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { testId, answers } = req.body;
    const test = await Test.findById(testId).populate("mcqs");
    if (!test) return res.status(404).json({ message: "Test not found" });
    let score = 0;
    test.answers = answers;
    test.completed = true;
    test.mcqs.forEach((mcq: any, idx: number) => {
      if (answers[idx] === mcq.answer) score++;
    });
    test.score = score;
    
    // Prepare data for LLM analysis
    const analysisData = {
      topic: test.topic ? (test.topic as any).name : "Unknown Topic",
      totalQuestions: test.mcqs.length,
      score,
      questions: test.mcqs.map((mcq: any, idx: number) => ({
        question: mcq.question,
        correctAnswer: mcq.answer,
        studentAnswer: answers[idx],
        isCorrect: answers[idx] === mcq.answer
      }))
    };

    // Trigger analysis asynchronously (awaiting it here for simplicity, but could be background)
    const analysis = await analyzeTestPerformance(analysisData);
    if (analysis) {
      (test as any).analysis = analysis;
    }

    await test.save();
    // Clear summary report
    const report = {
      student: test.student,
      topic: test.topic,
      score,
      total: test.mcqs.length,
      percentage: ((score / test.mcqs.length) * 100).toFixed(2),
      details: test.mcqs.map((mcq: any, idx: number) => ({
        question: mcq.question,
        correctAnswer: mcq.answer,
        yourAnswer: answers[idx],
        isCorrect: answers[idx] === mcq.answer,
      })),
      analysis: (test as any).analysis 
    };
    res.json({ test, report });
  } catch (err) {
    res.status(500).json({ message: "Error submitting test", error: err });
  }
};

export const getMyReports = async (req: Request, res: Response) => {
  try {
    const studentId = req.user.id;
    const tests = await Test.find({ student: studentId, completed: true })
      .populate("topic")
      .sort({ createdAt: -1 });
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id)
      .populate("topic")
      .populate("mcqs")
      .populate("student", "name email");
    
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Access control: only the student who took it or a teacher
    // test.student is now an object due to populate
    const studentId = (test.student as any)._id.toString();
    
    // @ts-ignore
    if (req.user.role !== "teacher" && studentId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Reconstruct report (similar to submit response)
    const report = {
      student: test.student,
      topic: test.topic,
      score: test.score,
      total: test.mcqs.length,
      percentage: test.mcqs.length ? ((test.score / test.mcqs.length) * 100).toFixed(2) : 0,
            // @ts-ignore
      details: test.mcqs.map((mcq: any, idx: number) => ({
        question: mcq.question,
        correctAnswer: mcq.answer,
        yourAnswer: test.answers[idx],
        isCorrect: test.answers[idx] === mcq.answer,
      })),
      analysis: (test as any).analysis 
    };

    res.json({ test, report });
  } catch (err) {
    res.status(500).json({ message: "Error fetching test", error: err });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    // For teachers: get all completed tests
    const tests = await Test.find({ completed: true })
      .populate("student", "name email")
      .populate("topic", "name")
      .sort({ createdAt: -1 });
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ message: "Error fetching all reports", error: err });
  }
};
