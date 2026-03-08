import mongoose, { Schema, Document } from "mongoose";

export interface IMCQ extends Document {
  topic: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  answer: string;
}

const MCQSchema: Schema = new Schema({
  topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
}, { timestamps: true });

const MCQ = mongoose.model<IMCQ>("MCQ", MCQSchema);

export default MCQ;
