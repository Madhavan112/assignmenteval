import { useEffect, useState } from "react";
import { getMyReportsApi } from "../../api/testApi";
import toast from "react-hot-toast";

export default function StudentTestHistory({ onSelectTest }: { onSelectTest: (test: any) => void }) {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await getMyReportsApi();
      setTests(res.data.tests || []);
    } catch (err) {
      toast.error("Failed to load test history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  if (tests.length === 0) {
    return <div className="p-4 bg-white border rounded text-gray-500">No past tests found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Test History</h2>
      <div className="space-y-3">
        {tests.map((test) => (
          <div key={test._id} className="bg-white p-4 rounded border shadow-sm flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-800">{test.topic?.title || "Unknown Topic"}</div>
              <div className="text-sm text-gray-500">
                Score: {test.score} / {test.mcqs?.length ?? "?"} • {new Date(test.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => onSelectTest(test)}
              className="bg-sky-100 text-sky-700 px-3 py-1 rounded text-sm hover:bg-sky-200"
            >
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
