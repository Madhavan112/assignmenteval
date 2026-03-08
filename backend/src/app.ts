import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import assignmentRoutes from "./routes/assignment.routes";
import topicRoutes from "./routes/topic.routes";
import testRoutes from "./routes/test.routes";



dotenv.config();
connectDB();

const app = express();
app.use(cors({
	origin: "http://localhost:5173", // or your frontend URL
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/tests", testRoutes);

export default app;
