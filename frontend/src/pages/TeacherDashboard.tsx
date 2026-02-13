// ... imports same as before ...
import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/teacher/Sidebar";

import AssignmentForm from "@/components/teacher/AssignmentForm";
import AssignmentList from "@/components/teacher/AssignmentList";
import SubmissionCard from "@/components/teacher/SubmissionCard";
import TopicForm from "@/components/teacher/TopicForm";
import TopicList from "@/components/teacher/TopicList";
import AnalyticsDashboard from "@/components/teacher/AnalyticsDashboard";

import {
  createAssignmentApi,
  getMyAssignmentsApi,
  getAssignmentSubmissionsApi,
} from "../api/assignmentApi";
import { getTestByIdApi } from "../api/testApi";
import TeacherTestList from "@/components/teacher/TeacherTestList";
import TestReport from "@/components/student/TestReport";

import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TeacherDashboard() {
  const user = useAuthStore((s: any) => s.user);

  const [activePanel, setActivePanel] = useState<string>("assignments"); // default
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  
  // report state
  const [activeTestReport, setActiveTestReport] = useState<any>(null);

  const handleSelectTestReport = async (test: any) => {
      // Use getTestByIdApi to fetch full report details derived from updated controller
      try {
        const res = await getTestByIdApi(test._id);
        setActiveTestReport(res.data.report);
      } catch (err) {
        toast.error("Failed to load full report");
      }
  };


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
      console.log("Requesting submissions for:", assignmentId);
      const res = await getAssignmentSubmissionsApi(assignmentId);
      console.log("Submissions response:", res.data);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      toast.error("Failed to load submissions");
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  };


  // topic state for teacher
  const [topicsRefresh, setTopicsRefresh] = useState(0);

  function renderCenter() {
    switch (activePanel) {
      case "create":
        return <AssignmentForm onCreate={handleCreate} />;
      case "assignments":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-heading font-semibold mb-4">My Assignments</h2>
            <AssignmentList assignments={assignments} onView={handleViewSubmissions} />
          </div>
        );
      case "topics":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TopicForm onTopicCreated={() => setTopicsRefresh((c) => c + 1)} />
            <TopicList key={topicsRefresh} />
          </div>
        );
      case "submissions":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-heading font-semibold mb-4">
              Submissions {selectedAssignmentId ? `for ${selectedAssignmentId}` : ""}
            </h2>
            {!loadingSubs && submissions.length === 0 && (
              <div className="p-8 bg-white/50 border border-dashed rounded-xl text-center text-muted-foreground">No submissions yet</div>
            )}
            <div className="space-y-4">
              {submissions.map((s) => (
                <SubmissionCard key={s._id} s={s} />
              ))}
            </div>
          </div>
        );
      case "analytics":
        return <AnalyticsDashboard />;
      case "settings":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-heading font-semibold mb-4">Settings</h2>
            <div className="p-8 bg-white/50 border rounded-xl">
              <p className="text-muted-foreground">Profile & preferences settings.</p>
            </div>
          </div>
        );
      case "reports":
        return (
           activeTestReport ? (
             <TestReport report={activeTestReport} onBack={() => setActiveTestReport(null)} />
           ) : (
             <TeacherTestList onSelectTest={handleSelectTestReport} />
           )
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary/20 flex font-sans text-foreground selection:bg-primary/20">
      <Sidebar active={activePanel} onChange={setActivePanel} />

      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <header className="flex items-center justify-between pb-6 border-b border-border/40">
            <div>
                 <h1 className="text-3xl font-heading font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                     Teacher Dashboard
                 </h1>
                 <p className="text-muted-foreground mt-1">Manage assignments, tests, and student progress.</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative hidden md:block w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                   <Input placeholder="Search..." className="pl-9 h-10 bg-white/50 border-border/50" />
               </div>
               <Button size="icon" variant="ghost" className="relative">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
               </Button>
            </div>
          </header>
        </div>

        {/* center content */}
        <div>{renderCenter()}</div>
      </main>

      {/* optional right column (quick info) */}
      <aside className="w-80 border-l border-border/40 p-6 hidden xl:block glass">
        <div className="font-heading font-semibold mb-4 text-lg">Overview</div>
        <div className="space-y-4">
            <div className="bg-white/60 dark:bg-black/20 border border-border/50 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Assignments</div>
              <div className="text-2xl font-bold text-primary">{assignments.length}</div>
            </div>
            
            <div className="bg-white/60 dark:bg-black/20 border border-border/50 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Active Selection</div>
              <div className="text-sm font-medium truncate">{selectedAssignmentId ? selectedAssignmentId : "None"}</div>
            </div>

            <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                        <Bell size={16} />
                    </div>
                    <div>
                        <div className="text-sm font-medium">New Feature</div>
                        <div className="text-xs text-muted-foreground mt-1">AI-powered grading is now live. Check the settings to enable.</div>
                    </div>
                </div>
            </div>
        </div>
      </aside>
    </div>
  );
}
