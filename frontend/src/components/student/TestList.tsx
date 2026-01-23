
import React, { useEffect, useState } from "react";
import { getTopics, startTest } from "@/api/testApi";

type Topic = {
  _id: string;
  title: string;
  description: string;
  mcqs: any[];
};

type TestListProps = {
  onStartTest?: (test: any) => void;
};

const TestList: React.FC<TestListProps> = ({ onStartTest }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  // Track taken tests by storing their topic IDs in localStorage
  const [takenTests, setTakenTests] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("takenTests") || "[]");
    } catch {
      return [];
    }
  });





  useEffect(() => {
    getTopics().then((data: any) => {
      if (Array.isArray(data)) {
        setTopics(data);
      } else if (Array.isArray(data.data)) {
        setTopics(data.data);
      }
      setLoading(false);
    });
  }, []);

  const handleStart = async (topicId: string) => {
    try {
      const response = await startTest(topicId);
      const test = response?.data?.test;
      if (onStartTest) onStartTest(test);
    } catch (err) {
      alert("Failed to start test. See console for details.");
    }
  };

  if (loading) return <div>Loading topics...</div>;

  const markTestTaken = (topicId: string) => {
    const updated = Array.from(new Set([...takenTests, topicId]));
    setTakenTests(updated);
    localStorage.setItem("takenTests", JSON.stringify(updated));
  };

  const handleStartWithMark = async (topicId: string) => {
    await handleStart(topicId);
    markTestTaken(topicId);
  };

  // Render test list (hooks must not be inside this function)
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Available Tests</h2>
      {topics.map(topic => {
        const alreadyTaken = takenTests.includes(topic._id);
        return (
          <div key={topic._id} className="border p-3 rounded">
            <div className="font-semibold">{topic.title}</div>
            <div className="text-sm text-gray-600">{topic.description}</div>
            <button
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
              onClick={() => handleStartWithMark(topic._id)}
              disabled={alreadyTaken}
            >
              {alreadyTaken ? "Test Taken" : "Start Test"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TestList;
