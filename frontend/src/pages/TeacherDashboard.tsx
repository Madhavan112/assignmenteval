import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/teacher/Sidebar";
import AssignmentForm from "@/components/teacher/AssignmentForm";
import AssignmentList from "@/components/teacher/AssignmentList";
import SubmissionCard from "@/components/teacher/SubmissionCard";

import {
  createAssignmentApi,
  getMyAssignmentsApi,
  getAssignmentSubmissionsApi,
} from "../api/assignmentApi";

import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function TeacherDashboard() {
  const user = useAuthStore((s: any) => s.user);

  const [activePanel, setActivePanel] = useState<string>("assignments"); // default
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // load assignments
  const loadAssignments = useCallback(async () => {
    try {
      const res = await getMyAssignmentsApi();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      toast.error("Failed to load assignments");
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // create handler
  const handleCreate = async (formData: any) => {
    try {
      await createAssignmentApi(formData);
      toast.success("Assignment created");
      await loadAssignments();
      setActivePanel("assignments"); // show list after create
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create");
    }
  };

  // view submissions for assignment
  const handleViewSubmissions = async (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setActivePanel("submissions");
    setLoadingSubs(true);
    try {
      const res = await getAssignmentSubmissionsApi(assignmentId);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      toast.error("Failed to load submissions");
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  };

  // central panel renderer
  function renderCenter() {
    switch (activePanel) {
      case "create":
        return <AssignmentForm onCreate={handleCreate} />;
      case "assignments":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3">My Assignments</h2>
            <AssignmentList assignments={assignments} onView={handleViewSubmissions} />
          </div>
        );
      case "submissions":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Submissions {selectedAssignmentId ? `for ${selectedAssignmentId}` : ""}
            </h2>
            {!loadingSubs && submissions.length === 0 && (
              <div className="p-4 bg-white border rounded text-sm text-gray-500">No submissions yet</div>
            )}
            <div className="space-y-3">
              {submissions.map((s) => (
                <SubmissionCard key={s._id} s={s} />
              ))}
            </div>
          </div>
        );
      case "analytics":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3">Analytics</h2>
            <div className="p-6 bg-white border rounded">
              {/* placeholder — you can add charts here */}
              <p className="text-sm text-gray-600">Analytics coming soon — average scores, submission counts, etc.</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div>
            <h2 className="text-lg font-semibold mb-3">Settings</h2>
            <div className="p-6 bg-white border rounded">
              <p className="text-sm text-gray-600">Profile & preferences</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar active={activePanel} onChange={setActivePanel} />

      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <div className="text-sm text-gray-500">Welcome, {user?.name}</div>
          </div>
        </div>

        {/* center content */}
        <div>{renderCenter()}</div>
      </main>

      {/* optional right column (quick info) */}
      <aside className="w-80 border-l p-4 hidden xl:block">
        <div className="text-sm text-gray-700 font-semibold mb-2">Quick Info</div>
        <div className="bg-white border rounded p-3">
          <div className="text-xs text-gray-500">Assignments</div>
          <div className="text-lg font-medium">{assignments.length}</div>
        </div>
        <div className="mt-3 bg-white border rounded p-3">
          <div className="text-xs text-gray-500">Selected Assignment</div>
          <div className="text-sm">{selectedAssignmentId ?? "None"}</div>
        </div>
      </aside>
    </div>
  );
}
