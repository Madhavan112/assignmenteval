import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { List, Plus, FileText, ChartBar, LogOut } from "lucide-react";

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
    <aside className="w-72 bg-white border-r min-h-screen p-4 sticky top-0">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <div className="rounded-full bg-slate-200 flex items-center justify-center text-sm">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </Avatar>

        <div>
          <div className="font-semibold">{user?.name ?? "Teacher"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      </div>

      <Separator className="my-3" />

      <nav className="space-y-1">
        <SidebarItem
          label="Create Assignment"
          active={active === "create"}
          onClick={() => onChange("create")}
          icon={<Plus size={16} />}
        />
        <SidebarItem
          label="Assignments"
          active={active === "assignments"}
          onClick={() => onChange("assignments")}
          icon={<List size={16} />}
        />
        <SidebarItem
          label="Submissions"
          active={active === "submissions"}
          onClick={() => onChange("submissions")}
          icon={<FileText size={16} />}
        />
        <SidebarItem
          label="Analytics"
          active={active === "analytics"}
          onClick={() => onChange("analytics")}
          icon={<ChartBar size={16} />}
        />
        <SidebarItem
          label="Settings"
          active={active === "settings"}
          onClick={() => onChange("settings")}
          icon={<List size={16} />}
        />
      </nav>

      <div className="mt-6">
        <Button variant="ghost" className="w-full flex items-center gap-2" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </aside>
  );
}

function SidebarItem({ label, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${
        active
          ? "bg-sky-50 text-sky-700 font-medium"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="text-gray-500">{icon}</div>
      <div>{label}</div>
    </button>
  );
}
