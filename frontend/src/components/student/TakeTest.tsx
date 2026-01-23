import React, { useState } from "react";
import { submitTest } from "@/api/testApi";

type MCQ = {
  _id: string;
  question: string;
  options: string[];
};

type Test = {
  _id: string;
  topic: { title: string };
  mcqs: MCQ[];
};

type TakeTestProps = {
  test: Test;
  onTestSubmitted?: (report: any) => void;
};

const TakeTest: React.FC<TakeTestProps> = ({ test, onTestSubmitted }) => {
  const [answers, setAnswers] = useState<string[]>(Array(test.mcqs.length).fill(""));
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (idx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitTest(test._id, answers);
      // Handle axios response structure or direct data if interceptors exist
      const report = res.data?.report || res.report; 
      if (onTestSubmitted && report) {
        onTestSubmitted(report);
      } else {
        console.error("No report found in response", res);
      }
    } catch (err) {
      console.error("Failed to submit test", err);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-bold">Test: {test.topic.title}</h2>
      {test.mcqs.map((mcq, idx) => (
        <div key={mcq._id} className="border p-3 rounded">
          <div className="font-semibold">Q{idx + 1}: {mcq.question}</div>
          {mcq.options.map((opt, oidx) => (
            <label key={oidx} className="block">
              <input
                type="radio"
                name={`q${idx}`}
                value={opt}
                checked={answers[idx] === opt}
                onChange={() => handleChange(idx, opt)}
                required
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Test"}
      </button>
    </form>
  );
};

export default TakeTest;
