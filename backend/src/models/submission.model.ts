import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    pdfUrl: { type: String, required: true },  // Cloudinary link
    rawText: { type: String },                 // OCR output

    score: Number,
    summary: String,
    strengths: [String],
    weaknesses: [String],
    llmRaw: Schema.Types.Mixed,

    status: {
      type: String,
      enum: ["pending", "evaluated", "error"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
