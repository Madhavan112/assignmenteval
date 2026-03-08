import mongoose, { Schema, Document } from "mongoose";

export interface ITest extends Document {
  student: mongoose.Types.ObjectId;
  topic: mongoose.Types.ObjectId;
  mcqs: mongoose.Types.ObjectId[];
  answers: string[];
  score: number;
  completed: boolean;
}

const TestSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  mcqs: [{ type: Schema.Types.ObjectId, ref: "MCQ" }],
  answers: [{ type: String }],
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  analysis: {
    summary: String,
    strengths: [String],
    weaknesses: [String],
    improvementTips: [String],
  },
}, { timestamps: true });

const Test = mongoose.model<ITest>("Test", TestSchema);

export default Test;
