// src/pages/StudentDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import StudentSidebar from "@/components/student/StudentSideBar";
import AssignmentCard from "@/components/student/AssignmentCard";
import SubmissionCard from "@/components/student/SubmissionCard";
import TestList from "@/components/student/TestList";
import TakeTest from "@/components/student/TakeTest";
import { FileText } from "lucide-react";
import TestReport from "@/components/student/TestReport";
import TestCompleted from "@/components/student/TestCompleted";
import StudentTestHistory from "@/components/student/StudentTestHistory";
import { listAssignmentsApi, submitAssignmentApi } from "../api/assignmentApi";
import { getTestByIdApi } from "../api/testApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
    
  const user = useAuthStore((s: any) => s.user);

  const [active, setActive] = useState<string>("assignments");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  // test-taking state
  const [testPanel, setTestPanel] = useState<"list" | "take" | "completed" | "report">("list");
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testReport, setTestReport] = useState<any>(null);

  // progress mapping: assignmentId -> percent
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // submissions list (pushed after upload)
  const [submissions, setSubmissions] = useState<any[]>([]);

  const loadAssignments = useCallback(async () => {
    try {
      const res = await listAssignmentsApi();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      toast.error("Failed to load assignments");
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handleUpload = async (assignmentId: string, file: File) => {
    setUploadingId(assignmentId);
    setUploadProgress((p) => ({ ...p, [assignmentId]: 0 }));

    try {
      const res = await submitAssignmentApi(assignmentId, file, (percent) => {
        setUploadProgress((p) => ({ ...p, [assignmentId]: percent }));
      });

      const submission = res.data.submission;
      // attach assignment title for display
      submission.assignmentTitle = assignments.find((a) => a._id === assignmentId)?.title ?? "";

      // add to local submissions list
      setSubmissions((s) => [submission, ...s]);

      toast.success("Uploaded & evaluated!");
      setActive("submissions");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingId(null);
      // remove the progress entry after a small delay so users see 100%
      setTimeout(() => {
        setUploadProgress((p) => {
          const copy = { ...p };
          delete copy[assignmentId];
          return copy;
        });
      }, 1500);
    }
  };

  const handleViewHistory = async (testId: string) => {
      try {
          const res = await getTestByIdApi(testId);
          setTestReport(res.data.report);
          setTestPanel("report");
          setActive("tests");
      } catch (err) {
          toast.error("Failed to load report");
      }
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground">
      <StudentSidebar active={active} onChange={setActive} />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full transition-all duration-300">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10 pb-6 border-b border-border/40">
          <div>
            <h1 className="text-3xl font-heading font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {active === 'assignments' ? 'Assignments' : 
                 active === 'tests' ? 'Tests' : 
                 active === 'submissions' ? 'Submissions' : 
                 active === 'upload' ? 'Upload' : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, <span className="font-semibold text-foreground">{user?.name}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 rounded-full border border-border bg-white dark:bg-black/20 focus:outline-hidden focus:ring-2 focus:ring-primary/20 w-64 text-sm"
                  />
              </div>
              <Button variant="outline" size="icon" className="rounded-full relative">
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
              </Button>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Assignment panels */}
          {active === "assignments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Available Assignments</h2>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{assignments.length} Active</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {assignments.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    a={a}
                    uploading={uploadingId === a._id}
                    progress={uploadProgress[a._id] ?? null}
                    onChooseFile={handleUpload}
                  />
                ))}
              </div>
            </div>
          )}

          {active === "upload" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                  <h2 className="text-xl font-semibold tracking-tight">Upload Assignment</h2>
                  <p className="text-sm text-muted-foreground mt-1">Choose an assignment from the list below to submit your work.</p>
              </div>

              <div className="space-y-4">
                {assignments.map((a) => (
                  <AssignmentCard
                    key={a._id}
                    a={a}
                    uploading={uploadingId === a._id}
                    progress={uploadProgress[a._id] ?? null}
                    onChooseFile={handleUpload}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Test panels */}
          {active === "tests" && (
            <div className="space-y-6">
              {testPanel === "list" && (
                <TestList
                  onStartTest={(test) => {
                    setActiveTest(test);
                    setTestPanel("take");
                  }}
                />
              )}
              {testPanel === "take" && activeTest && (
                <TakeTest
                  test={activeTest}
                  onTestSubmitted={(report) => {
                    setTestReport(report);
                    setTestPanel("completed");
                  }}
                />
              )}
              {testPanel === "completed" && testReport && (
                <TestCompleted
                  report={testReport}
                  onViewReport={() => setTestPanel("report")}
                  onBackToDashboard={() => {
                    setTestPanel("list");
                    setTestReport(null);
                    setActiveTest(null);
                  }}
                />
              )}
              {testPanel === "report" && testReport && (
                <TestReport 
                  report={testReport} 
                  onBack={() => {
                    setTestPanel("list");
                    setTestReport(null);
                    setActiveTest(null);
                  }}
                />
              )}
            </div>
          )}

          {active === "test-history" && (
             <StudentTestHistory onSelectTest={(test) => {
               setTestReport(null); 
               handleViewHistory(test._id);
             }} />
          )}

          {active === "submissions" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold tracking-tight">My Submissions</h2>

              {submissions.length === 0 ? (
                <div className="p-8 border border-dashed border-border rounded-xl text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <FileText className="text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No submissions yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload an assignment to see it here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((s) => (
                    <SubmissionCard key={s._id} s={s} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <aside className="w-80 border-l border-border/40 p-6 hidden 2xl:block bg-white/30 dark:bg-black/10 backdrop-blur-sm">
        <div className="text-sm text-foreground font-semibold mb-4 uppercase tracking-wider">Overview</div>
        
        <div className="space-y-4">
            <div className="bg-white dark:bg-card border border-border/50 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-muted-foreground font-medium">Active Assignments</div>
              <div className="text-3xl font-bold font-heading text-primary mt-1">{assignments.length}</div>
            </div>

            <div className="bg-white dark:bg-card border border-border/50 rounded-xl p-4 shadow-xs">
              <div className="text-xs text-muted-foreground font-medium">Completed Submissions</div>
              <div className="text-3xl font-bold font-heading text-emerald-500 mt-1">{submissions.length}</div>
            </div>
        </div>
      </aside>
    </div>
  );
}
