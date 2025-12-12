import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

const isAuth = () => localStorage.getItem("token") !== null;
const getRole = () => JSON.parse(localStorage.getItem("user") || "{}")?.role;

// eslint-disable-next-line react-refresh/only-export-components
const Protected = ({ role, children }: any) => {
  if (!isAuth()) return <Navigate to="/login" />;
  if (getRole() !== role) return <Navigate to="/login" />;
  return children;
};

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Signup /> },

  {
    path: "/student",
    element: (
      <Protected role="student">
        <StudentDashboard />
      </Protected>
    ),
  },
  {
    path: "/teacher",
    element: (
      <Protected role="teacher">
        <TeacherDashboard />
      </Protected>
    ),
  },
]);
