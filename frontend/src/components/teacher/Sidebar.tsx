import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { List, Plus, FileText, ChartBar, LogOut, Settings, GraduationCap } from "lucide-react";

type Props = {
  active: string;
  onChange: (key: string) => void;
};

export default function Sidebar({ active, onChange }: Props) {
  const nav = useNavigate();
  const logout = useAuthStore((s: any) => s.logout);
  const user = useAuthStore((s: any) => s.user);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <aside className="w-72 glass border-r border-white/20 min-h-screen p-6 sticky top-0 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {user?.name?.[0]?.toUpperCase() ?? "T"}
          </AvatarFallback>
        </Avatar>

        <div>
           <div className="font-heading font-bold text-lg leading-tight">{user?.name ?? "Teacher"}</div>
           <div className="text-xs text-muted-foreground font-medium">{user?.email}</div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        <SidebarItem
          label="Create Assignment"
          active={active === "create"}
          onClick={() => onChange("create")}
          icon={<Plus size={18} />}
        />
        <SidebarItem
          label="Assignments"
          active={active === "assignments"}
          onClick={() => onChange("assignments")}
          icon={<List size={18} />}
        />
        <SidebarItem
          label="Topics"
          active={active === "topics"}
          onClick={() => onChange("topics")}
          icon={<FileText size={18} />}
        />
        <SidebarItem
          label="Student Reports"
          active={active === "reports"}
          onClick={() => onChange("reports")}
          icon={<GraduationCap size={18} />}
        />
        <SidebarItem
          label="Submissions"
          active={active === "submissions"}
          onClick={() => onChange("submissions")}
          icon={<FileText size={18} />}
        />
        <SidebarItem
          label="Analytics"
          active={active === "analytics"}
          onClick={() => onChange("analytics")}
          icon={<ChartBar size={18} />}
        />
        <div className="pt-4 mt-4 border-t border-border/40">
            <SidebarItem
              label="Settings"
              active={active === "settings"}
              onClick={() => onChange("settings")}
              icon={<Settings size={18} />}
            />
        </div>
      </nav>

      <div className="mt-6">
        <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start gap-3 hover:bg-destructive/10 hover:text-destructive transition-colors" 
            onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({ label, active, onClick, icon }: any) {
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
