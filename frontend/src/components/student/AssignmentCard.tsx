// src/components/student/AssignmentCard.tsx
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AssignmentCard({
  a,
  uploading,
  progress,
  onChooseFile,
}: {
  a: any;
  uploading: boolean;
  progress?: number | null;
  onChooseFile: (assignmentId: string, file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    // open file dialog
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onChooseFile(a._id, f);
    // reset so user can select same file again if needed
    if (e.currentTarget) e.currentTarget.value = "";
  };

  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1">
          <div className="font-semibold">{a.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            By: {a.teacherId?.name} · Max: {a.maxMarks}{" "}
            {a.dueDate && `| Due: ${new Date(a.dueDate).toLocaleDateString()}`}
          </div>
          {a.description && <div className="mt-2 text-sm text-gray-700">{a.description}</div>}
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
          <label className="text-xs text-gray-600">Upload PDF</label>

          {/* hidden input */}
          <input
            ref={inputRef}
            id={`file-${a._id}`}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFileChange}
            disabled={uploading}
          />

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleButtonClick} disabled={uploading}>
              {uploading ? "Uploading..." : "Choose & Upload"}
            </Button>
          </div>

          {typeof progress === "number" && (
            <div className="w-full sm:w-56 mt-2">
              <div className="text-xs text-gray-600 mb-1">{progress}%</div>
              <Progress value={progress} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
