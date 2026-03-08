import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { Toaster, toast } from "react-hot-toast";

// LOGIN COMPONENT
export default function Login() {
  const nav = useNavigate();
  const { setAuth, user } = useAuthStore((s: any) => s);
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      const target = user.role === "student" ? "/student" : "/teacher";
      nav(target, { replace: true });
    }
  }, [user, nav]);

  const change = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const res = await loginApi(data);
      setAuth(res.data.user, res.data.token);
      toast.success("Login successful!");

      if (res.data.user.role === "student") nav("/student");
      else nav("/teacher");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Toaster />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" placeholder="Enter email" onChange={change} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={change}
            />
          </div>

          <Button className="w-full" onClick={submit}>
            Login
          </Button>

          <p className="text-center text-sm text-gray-600">
            New here?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => nav("/register")}
            >
              Create an account
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
