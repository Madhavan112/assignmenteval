// src/pages/StudentDashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import StudentSidebar from "@/components/student/StudentSideBar";
import AssignmentCard from "@/components/student/AssignmentCard";
import SubmissionCard from "@/components/student/SubmissionCard";
import { listAssignmentsApi, submitAssignmentApi } from "../api/assignmentApi";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function StudentDashboard() {
  const user = useAuthStore((s: any) => s.user);

  const [active, setActive] = useState<string>("assignments");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar active={active} onChange={setActive} />

      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="text-sm text-gray-500">Hi, {user?.name}</div>
        </div>

        <div>
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
