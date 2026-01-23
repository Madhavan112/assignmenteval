// src/components/student/StudentSidebar.tsx
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { List, Archive, Plus, LogOut,FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function StudentSidebar({
  active,
  onChange,
}: {
  active: string;
  onChange: (k: string) => void;
}) {
  const nav = useNavigate();
  const logout = useAuthStore((s: any) => s.logout);
  const user = useAuthStore((s: any) => s.user);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <aside className="w-72 bg-white border-r min-h-screen p-4 sticky top-0">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <div className="rounded-full bg-slate-200 flex items-center justify-center text-sm">
            {user?.name?.[0]?.toUpperCase() ?? "S"}
          </div>
        </Avatar>

        <div>
          <div className="font-semibold">{user?.name ?? "Student"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      </div>

      <Separator className="my-3" />

      <nav className="space-y-1">
        <SidebarItem label="Assignments" active={active === "assignments"} onClick={() => onChange("assignments")} icon={<List size={16} />} />
        <SidebarItem label="Tests" active={active === "tests"} onClick={() => onChange("tests")} icon={<FileText size={16} />} />
        <SidebarItem label="Test History" active={active === "test-history"} onClick={() => onChange("test-history")} icon={<List size={16} />} />
        <SidebarItem label="My Submissions" active={active === "submissions"} onClick={() => onChange("submissions")} icon={<Archive size={16} />} />
        <SidebarItem label="New Upload" active={active === "upload"} onClick={() => onChange("upload")} icon={<Plus size={16} />} />
      </nav>

      <div className="mt-6">
        <Button variant="ghost" className="w-full flex items-center gap-2" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${
        active ? "bg-sky-50 text-sky-700 font-medium" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="text-gray-500">{icon}</div>
      <div>{label}</div>
    </button>
  );
}
