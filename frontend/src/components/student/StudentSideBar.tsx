// src/components/student/StudentSidebar.tsx
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { List, Archive, Plus, LogOut, FileText } from "lucide-react";
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
    <aside className="w-80 h-screen sticky top-0 glass border-r-0 z-20 flex flex-col p-6 transition-all duration-300">
        
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 p-2 rounded-xl hover:bg-white/50 transition-colors cursor-default">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <div className="h-full w-full rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.name?.[0]?.toUpperCase() ?? "S"}
          </div>
        </Avatar>

        <div className="overflow-hidden">
          <div className="font-heading font-bold text-lg truncate text-foreground">{user?.name ?? "Student"}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</div>
        <SidebarItem label="Assignments" active={active === "assignments"} onClick={() => onChange("assignments")} icon={<List size={20} />} />
        <SidebarItem label="Tests" active={active === "tests"} onClick={() => onChange("tests")} icon={<FileText size={20} />} />
        <SidebarItem label="Test History" active={active === "test-history"} onClick={() => onChange("test-history")} icon={<List size={20} />} />
        
        <div className="px-2 mt-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</div>
        <SidebarItem label="My Submissions" active={active === "submissions"} onClick={() => onChange("submissions")} icon={<Archive size={20} />} />
        <SidebarItem label="New Upload" active={active === "upload"} onClick={() => onChange("upload")} icon={<Plus size={20} />} />
      </nav>

      <div className="mt-6 pt-6 border-t border-border/50">
        <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start gap-3 hover:bg-destructive/10 hover:text-destructive transition-colors h-12 rounded-xl" 
            onClick={handleLogout}
        >
          <LogOut size={20} /> 
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({ label, icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        active 
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-medium" 
        : "text-muted-foreground hover:bg-white/60 dark:hover:bg-white/5 hover:text-foreground"
      }`}
    >
      <div className={`relative z-10 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </div>
      <div className="relative z-10">{label}</div>
    </button>
  );
}
