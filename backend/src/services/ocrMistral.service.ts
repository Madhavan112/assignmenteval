import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
dotenv.config();

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
});

export async function extractTextFromPdf_Mistral(pdfUrl: string): Promise<string> {
  try {
    const result = await mistral.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "document_url",
        documentUrl: pdfUrl,
      },
    });

    console.log("🔍 FULL OCR RESULT:", JSON.stringify(result, null, 2));

    if (!result.pages || result.pages.length === 0) {
      console.warn("⚠️ Mistral OCR returned no pages");
      return "";
    }

    const finalText = result.pages
      .map((page: any) => page.markdown ?? "")
      .join("\n\n");

    // console.log("📄 OCR EXTRACTED TEXT:\n", finalText);

    return finalText.trim();
  } catch (err) {
    console.error("Mistral OCR Error:", err);
    return "";
  }
}


