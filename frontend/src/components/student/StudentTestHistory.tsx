import { useEffect, useState } from "react";
import { getMyReportsApi } from "../../api/testApi";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, History, Award, AlertCircle } from "lucide-react";

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

  if (loading) return (
      <div className="space-y-4">
          {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse"></div>
          ))}
      </div>
  );

  if (tests.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl text-center bg-muted/10">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <History className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">No test history</h3>
            <p className="text-muted-foreground mt-1 text-sm">You haven't taken any tests yet.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Test History</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{tests.length} records</span>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <Card key={test._id} className="card-hover border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm group overflow-hidden">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0
                    ${test.score / (test.mcqs?.length || 1) >= 0.7 
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}
                `}>
                    {Math.round((test.score / (test.mcqs?.length || 1)) * 100)}%
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-lg truncate pr-4">{test.topic?.title || "Unknown Topic"}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Award size={14} />
                            <span>Score: {test.score} / {test.mcqs?.length ?? "?"}</span>
                        </div>
                    </div>
                </div>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSelectTest(test)}
                    className="w-full sm:w-auto mt-2 sm:mt-0 gap-1 text-muted-foreground group-hover:text-primary transition-colors hover:bg-primary/10"
                >
                    View Report <ChevronRight size={16} />
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
