import { useEffect, useState } from "react";
import { getAllReportsApi } from "../../api/testApi";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  if (loading) return (
      <div className="space-y-4">
          <div className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
          <div className="h-64 w-full bg-muted/30 rounded-lg animate-pulse" />
      </div>
  );

  if (tests.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/10 border border-dashed rounded-xl">
            <p className="text-muted-foreground">No student reports found.</p>
        </div>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-lg font-heading font-semibold">Student Test Reports</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 border-b border-border/50">
            <tr>
              <th className="p-4 font-semibold text-foreground/80">Student</th>
              <th className="p-4 font-semibold text-foreground/80">Topic</th>
              <th className="p-4 font-semibold text-foreground/80">Score</th>
              <th className="p-4 font-semibold text-foreground/80">Percentage</th>
              <th className="p-4 font-semibold text-foreground/80">Date</th>
              <th className="p-4 font-semibold text-foreground/80 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {tests.map((test) => {
               const total = test.mcqs?.length || 0;
               const percent = total ? ((test.score / total) * 100).toFixed(1) : "0";
               return (
                <tr key={test._id} className="group hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground">{test.student?.name || "Unknown"}</td>
                  <td className="p-4 text-muted-foreground">{test.topic?.name || "Unknown"}</td>
                  <td className="p-4 font-mono">{test.score} / {total}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${Number(percent) >= 50 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"}`}>
                      {percent}%
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{new Date(test.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectTest(test)}
                      className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
