import React, { useEffect, useState } from "react";
import { getTopics } from "@/api/testApi";

type MCQ = {
  _id?: string;
  question: string;
  options: string[];
  answer: string;
};

type Topic = {
  _id: string;
  title: string;
  description: string;
  mcqs: MCQ[];
};

const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getTopics().then(data => {
      // If Axios returns { data: [...] }, use data.data; else use data
      if (Array.isArray(data)) {
        setTopics(data);
      } else if (Array.isArray(data.data)) {
        setTopics(data.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading topics...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Topics</h2>
      {topics.map(topic => (
        <div key={topic._id} className="border p-3 rounded">
          <div className="font-semibold">{topic.title}</div>
          <div className="text-sm text-gray-600">{topic.description}</div>
          <div className="text-xs text-gray-400">Questions: {topic.mcqs.length}</div>
          <button
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => setExpanded(expanded === topic._id ? null : topic._id)}
          >
            {expanded === topic._id ? "Hide MCQs" : "View MCQs"}
          </button>
          {expanded === topic._id && (
            <div className="mt-3 space-y-3">
              {topic.mcqs.length === 0 && <div className="text-sm text-gray-500">No MCQs generated.</div>}
              {topic.mcqs.map((mcq, idx) => (
                <div key={mcq._id || idx} className="border p-2 rounded bg-gray-50">
                  <div className="font-medium">Q{idx + 1}: {mcq.question}</div>
                  <ul className="list-disc ml-6">
                    {mcq.options.map((opt, oidx) => (
                      <li key={oidx}>{opt}</li>
                    ))}
                  </ul>
                  <div className="text-xs text-green-700 mt-1">Answer: {mcq.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopicList;
