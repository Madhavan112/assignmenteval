import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function extractJsonFromText(text: string) {
  // find the JSON object inside ANY surrounding text
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) return null;

  const jsonString = text.substring(first, last + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ JSON parse failed:", err);
    return null;
  }
}

function extractJsonArrayFromText(text: string) {
  // find the JSON array inside ANY surrounding text
  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first === -1 || last === -1) return null;
  const jsonString = text.substring(first, last + 1);
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ JSON array parse failed:", err);
    return null;
  }
}

export async function evaluateSubmissionWithGemini(
  evaluationPrompt: string,
  studentText: string,
  maxMarks: number
) {
  const prompt = `
Strict JSON ONLY. Do NOT add explanation. NO markdown. NO backticks.

Return EXACTLY this structure:
{
  "score": number,
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"]
}

Teacher rubric:
${evaluationPrompt}

Max marks = ${maxMarks}

Student answer:
${studentText}
`;

  // Call Gemini
  const result = await geminiModel.generateContent(prompt);
  const raw = result.response.text();

  console.log("🔵 RAW GEMINI RESPONSE:\n", raw);

  // Try to extract JSON
  let parsed = extractJsonFromText(raw);

  if (!parsed) {
    console.error("❌ Could not parse JSON from Gemini response");
    return {
      score: 0,
      summary: "Error parsing evaluation",
      strengths: [],
      weaknesses: [],
    };
  }

  return {
    score: parsed.score ?? 0,
    summary: parsed.summary ?? "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
  };
}

export async function generateMCQsFromLLM(
  title: string,
  description: string,
  numQuestions: number
): Promise<{ question: string; options: string[]; answer: string }[]> {
  const prompt = `
Strict JSON ONLY. Do NOT add explanation. NO markdown. NO backticks.

Return EXACTLY this structure:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": "string"
  }
]

Generate ${numQuestions} multiple-choice questions (with 4 options each and the correct answer) for the topic:
Title: ${title}
Description: ${description}
`;

  const result = await geminiModel.generateContent(prompt);
  const raw = result.response.text();
  console.log("🔵 RAW GEMINI MCQ RESPONSE:\n", raw);
  let parsed = extractJsonArrayFromText(raw);
  if (!parsed || !Array.isArray(parsed)) {
    console.error("❌ Could not parse MCQ JSON from Gemini response");
    return [];
  }
  return parsed;
}

export async function analyzeTestPerformance(testDetails: {
  topic: string;
  totalQuestions: number;
  score: number;
  questions: { question: string; correctAnswer: string; studentAnswer: string; isCorrect: boolean }[];
}) {
  const prompt = `
Strict JSON ONLY. Do NOT add explanation. NO markdown.
Return EXACTLY this structure:
{
  "summary": "string", 
  "strengths": ["string", "string"], 
  "weaknesses": ["string", "string"], 
  "improvementTips": ["string", "string"]
}

Analyze the following test performance:
Topic: ${testDetails.topic}
Score: ${testDetails.score} / ${testDetails.totalQuestions}

Questions Detail:
${JSON.stringify(testDetails.questions, null, 2)}

Provide a concise performance summary, identify key strengths and weaknesses based on the answers, and offer actionable tips for improvement.
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const raw = result.response.text();
    console.log("🔵 RAW GEMINI ANALYSIS RESPONSE:\n", raw);
    const parsed = extractJsonFromText(raw);
    
    if (!parsed) return null;

    return {
      summary: parsed.summary || "No summary available.",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      improvementTips: Array.isArray(parsed.improvementTips) ? parsed.improvementTips : [],
    };
  } catch (err) {
    console.error("❌ Error analyzing test:", err);
    return null;
  }
}
