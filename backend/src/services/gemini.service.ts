import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function extractJsonFromText(text: string) {
  // find the JSON inside ANY surrounding text
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
