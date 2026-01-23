// src/pages/StudentDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import StudentSidebar from "@/components/student/StudentSideBar";
import AssignmentCard from "@/components/student/AssignmentCard";
import SubmissionCard from "@/components/student/SubmissionCard";
import TestList from "@/components/student/TestList";
import TakeTest from "@/components/student/TakeTest";
import TestReport from "@/components/student/TestReport";
import TestCompleted from "@/components/student/TestCompleted";
import StudentTestHistory from "@/components/student/StudentTestHistory";
import { listAssignmentsApi, submitAssignmentApi } from "../api/assignmentApi";
import { getTestByIdApi } from "../api/testApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

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
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar active={active} onChange={setActive} />

      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="text-sm text-gray-500">Hi, {user?.name}</div>
        </div>

        <div>
          {/* Assignment panels */}
          {active === "assignments" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Available Assignments</h2>
              <div className="space-y-3">
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
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Upload Assignment</h2>
              <p className="text-sm text-gray-600">Choose an assignment from the list and upload your PDF.</p>

              <div className="mt-4 space-y-3">
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
            <div className="space-y-4">
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
               setTestReport(null); // Clear previous if any
               // Use a trick to reuse the report view:
               // Fetch full details if needed, but for now let's assume valid data or fetch it
               // Actually we need to set activeTest or testReport.
               // The report view uses testReport object.
               // The API returns { tests: [...] }. Each test item has score etc.
               // But TestReport expectation: { score, total, percentage, details: [...] }
               // The "details" might not be in the summary list if I didn't populate answers/mcqs fully or compute boolean flags.
               // Wait, getMyReports returns `tests` which are Test documents.
               // The Test document has `answers` and `mcqs` (populated).
               // I need to reconstruct the `details` array for the `TestReport` component because it expects { question, yourAnswer, correctAnswer, isCorrect }.
               // `getMyReports` controller just returns the test documents.
               // It does NOT reconstruct the `details` array.
               // I should probably fetch the single test report when clicked, using getTestByIdApi.
               handleViewHistory(test._id);
             }} />
          )}

          {active === "submissions" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">My Submissions</h2>

              {submissions.length === 0 ? (
                <div className="p-4 bg-white border rounded text-sm text-gray-500">No submissions yet</div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((s) => (
                    <SubmissionCard key={s._id} s={s} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <aside className="w-80 border-l p-4 hidden xl:block">
        <div className="text-sm text-gray-700 font-semibold mb-2">Quick Info</div>
        <div className="bg-white border rounded p-3">
          <div className="text-xs text-gray-500">Assignments</div>
          <div className="text-lg font-medium">{assignments.length}</div>
        </div>

        <div className="mt-3 bg-white border rounded p-3">
          <div className="text-xs text-gray-500">Submissions (local)</div>
          <div className="text-lg font-medium">{submissions.length}</div>
        </div>
      </aside>
    </div>
  );
}
