import mongoose, { Schema, Document } from "mongoose";

export interface ITopic extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  numQuestions: number;
  mcqs: mongoose.Types.ObjectId[];
}

const TopicSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  numQuestions: { type: Number, required: true },
  mcqs: [{ type: Schema.Types.ObjectId, ref: "MCQ" }],
}, { timestamps: true });

const Topic = mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
