import { Request, Response } from "express";
import Assignment from "../models/assignment.model";
import Submission from "../models/submission.model";
import { uploadPdfToCloudinary } from "../services/cloudinary.service";
import { extractTextFromPdf_Mistral } from "../services/ocrMistral.service";
import { evaluateSubmissionWithGemini } from "../services/gemini.service";


// ------------------ CREATE ASSIGNMENT (Teacher) ------------------
export const createAssignment = async (req: any, res: Response) => {
  try {
    const { title, description, evaluationPrompt, maxMarks, dueDate } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      evaluationPrompt,
      maxMarks,
      dueDate,
      teacherId: req.user.id,
    });

    res.status(201).json({ assignment });
  } catch (err) {
    res.status(500).json({ message: "Error creating assignment" });
  }
};


// ------------------ GET TEACHER ASSIGNMENTS ------------------
export const getMyAssignments = async (req: any, res: Response) => {
  try {
    const assignments = await Assignment.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignments" });
  }
};


// ------------------ LIST ALL ASSIGNMENTS (Student) ------------------
export const listAssignments = async (req: any, res: Response) => {
  try {
    const assignments = await Assignment.find().populate("teacherId", "name email");
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ message: "Error listing assignments" });
  }
};


// ------------------ SUBMIT ASSIGNMENT (Student) ------------------
export const submitAssignment = async (req: any, res: Response) => {
  try {
    const assignmentId = req.params.id;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 1) Upload PDF to Cloudinary
    const pdfUrl = await uploadPdfToCloudinary(req.file.path);

    // 2) Extract text using Mistral OCR
    const extractedText = await extractTextFromPdf_Mistral(pdfUrl);

    // 3) Get assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // 4) Evaluate using Gemini
    const evaluation = await evaluateSubmissionWithGemini(
      assignment.evaluationPrompt,
      extractedText,
      assignment.maxMarks
    );

    // 5) Save submission
    const submission = await Submission.create({
      assignmentId,
      studentId: req.user.id,
      pdfUrl,
      rawText: extractedText,
      score: evaluation.score,
      summary: evaluation.summary,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      llmRaw: evaluation,
      status: "evaluated",
    });

    res.status(201).json({ submission });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting assignment" });
  }
};


// ------------------ GET SUBMISSIONS FOR TEACHER ------------------
export const getAssignmentSubmissions = async (req: any, res: Response) => {
  try {
    console.log(`Fetching submissions for assignment: ${req.params.id}`);
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate("studentId", "name email");
    
    console.log(`Found ${submissions.length} submissions`);
    res.json({ submissions });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};
