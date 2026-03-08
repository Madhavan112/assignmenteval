// src/components/student/AssignmentCard.tsx
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, Calendar, CheckCircle } from "lucide-react";

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
    <Card className="card-hover border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-0 flex flex-col md:flex-row md:items-stretch h-full">
        
        {/* Left decoration */}
        <div className="hidden md:flex w-2 bg-primary/10 group-hover:bg-primary transition-colors"></div>

        <div className="flex-1 p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <FileText size={20} />
                </div>
                <div>
                   <h3 className="font-heading font-semibold text-lg leading-tight text-foreground">{a.title}</h3>
                   <div className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>{a.teacherId?.name}</span>
                      <span className="w-1 h-1 rounded-full bg-border"></span>
                      <span className="font-medium text-primary">Max: {a.maxMarks}</span>
                   </div>
                </div>
            </div>
            
            {a.dueDate && (
                 <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/50 text-accent-foreground">
                    <Calendar size={12} />
                    <span>Due {new Date(a.dueDate).toLocaleDateString()}</span>
                 </div>
            )}
          </div>

          {a.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.description}</p>}
        </div>

        <div className="border-t md:border-t-0 md:border-l border-border/50 p-5 bg-secondary/30 flex flex-col justify-center items-end min-w-[200px] gap-3">
          
          <div className="w-full">
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

              <div className="flex flex-col gap-3">
                <Button 
                    size="sm" 
                    onClick={handleButtonClick} 
                    disabled={uploading}
                    className="w-full shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                >
                  {uploading ? (
                      <>Processing...</>
                  ) : (
                      <><UploadCloud size={16} className="mr-2"/> Upload PDF</>
                  )}
                </Button>
              </div>

              {typeof progress === "number" && (
                <div className="w-full mt-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
