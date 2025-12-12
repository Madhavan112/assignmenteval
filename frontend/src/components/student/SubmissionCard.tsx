// src/components/student/SubmissionCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export default function SubmissionCard({ s }: { s: any }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{s.assignmentTitle ?? "Submission"}</div>
            <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">Score: {s.score ?? "-"}</div>
            <a
              href={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
                s.pdfUrl
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View PDF
            </a>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm font-semibold">Summary</div>
          <div className="text-sm text-gray-700 mt-1">{s.summary}</div>
        </div>

        {s.rawText && (
          <div className="mt-3 border rounded p-2 bg-white max-h-60 overflow-y-auto">
            <div className="text-xs font-semibold mb-2">OCR (extracted)</div>
            <ReactMarkdown>{s.rawText}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
