import { useState, useEffect } from "react";
import { registerApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const nav = useNavigate();
  const { setAuth, user } = useAuthStore((state: any) => state);

  useEffect(() => {
    if (user) {
      const target = user.role === "student" ? "/student" : "/teacher";
      nav(target, { replace: true });
    }
  }, [user, nav]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const change = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const res = await registerApi(form);
      setAuth(res.data.user, res.data.token);

      toast.success("Signup successful!");

      if (res.data.user.role === "student") nav("/student");
      else nav("/teacher");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Toaster />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              placeholder="Enter your name"
              onChange={change}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              onChange={change}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Choose password"
              onChange={change}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <select
              name="role"
              className="border rounded p-2 w-full"
              onChange={change}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <Button className="w-full" onClick={submit}>
            Sign Up
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => nav("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
