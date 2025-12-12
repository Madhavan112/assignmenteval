import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const nav = useNavigate();
  const logout = useAuthStore((s: any) => s.logout);
  const user = useAuthStore((s: any) => s.user);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    nav("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">AI Assess</div>
        <div className="text-sm text-gray-500">Teacher Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <div className="rounded-full bg-slate-200 flex items-center justify-center text-sm">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        )}

        <Button variant="ghost" onClick={() => nav("/teacher")}>Refresh</Button>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
          Logout
        </Button>
      </div>
    </header>
  );
}
