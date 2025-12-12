import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    evaluationPrompt: { type: String, required: true }, // teacher's evaluation guidelines
    maxMarks: { type: Number, default: 100 },
    dueDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
