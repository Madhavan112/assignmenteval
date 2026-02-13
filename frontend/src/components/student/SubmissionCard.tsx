// src/components/student/SubmissionCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, CheckCircle2, ExternalLink, Award } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function SubmissionCard({ s }: { s: any }) {
  return (
    <Card className="card-hover overflow-hidden border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
             <div className="mt-1 p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <CheckCircle2 size={20} />
             </div>
             <div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{s.assignmentTitle ?? "Submission"}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar size={12} />
                    <span>{new Date(s.createdAt).toLocaleString()}</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
                <Award size={14} />
                <span>Score: {s.score ?? "-"}</span>
            </div>
            {s.pdfUrl && (
                <a
                  href={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
                    s.pdfUrl
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-1"
                >
                  <span>View PDF</span>
                  <ExternalLink size={10} />
                </a>
            )}
          </div>
        </div>

        <div className="mt-5 bg-muted/30 p-4 rounded-xl border border-border/50">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            <FileText size={12} /> AI Feedback Summary
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">{s.summary}</div>
        </div>

        {s.rawText && (
          <div className="mt-4">
            <details className="group">
                <summary className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors">
                    <span>View OCR Extracted Text</span>
                </summary>
                <div className="mt-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50 max-h-40 overflow-y-auto">
                    <ReactMarkdown>{s.rawText}</ReactMarkdown>
                </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
