import React, { useState } from "react";
import { postTopic } from "@/api/testApi";

const TopicForm = ({ onTopicCreated }: { onTopicCreated?: (data: any) => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await postTopic({ title, description, numQuestions });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onTopicCreated && onTopicCreated(data);
      setTitle("");
      setDescription("");
      setNumQuestions(5);
    } catch (err) {
      setError(err?.response?.data?.message || "Error posting topic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2 className="text-lg font-bold">Post New Topic</h2>
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
      />
      <input
        className="border p-2 w-full"
        type="number"
        min={1}
        max={20}
        value={numQuestions}
        onChange={e => setNumQuestions(Number(e.target.value))}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Posting..." : "Post Topic"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default TopicForm;
