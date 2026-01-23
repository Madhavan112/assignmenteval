import { useEffect, useState } from "react";
import { getAllReportsApi } from "../../api/testApi";
import toast from "react-hot-toast";

export default function TeacherTestList({ onSelectTest }: { onSelectTest: (test: any) => void }) {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await getAllReportsApi();
      setTests(res.data.tests || []);
    } catch (err) {
      toast.error("Failed to load student reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  if (tests.length === 0) {
    return <div className="p-4 bg-white border rounded text-gray-500">No student reports found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Student Test Reports</h2>
      <div className="overflow-x-auto bg-white border rounded">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-medium">Student</th>
              <th className="p-3 font-medium">Topic</th>
              <th className="p-3 font-medium">Score</th>
              <th className="p-3 font-medium">Percentage</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => {
               const total = test.mcqs?.length || 0;
               const percent = total ? ((test.score / total) * 100).toFixed(1) : "0";
               return (
                <tr key={test._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium">{test.student?.name || "Unknown"}</td>
                  <td className="p-3 text-gray-600">{test.topic?.name || "Unknown"}</td>
                  <td className="p-3">{test.score} / {total}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${Number(percent) >= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {percent}%
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{new Date(test.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => onSelectTest(test)}
                      className="text-sky-600 hover:text-sky-800 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
