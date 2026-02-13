import React from "react";
import { CheckCircle2, ArrowRight, LayoutDashboard, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TestCompletedProps = {
  report: any;
  onViewReport: () => void;
  onBackToDashboard: () => void;
};

const TestCompleted: React.FC<TestCompletedProps> = ({ report, onViewReport, onBackToDashboard }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Test Submitted Successfully!</h2>
      <p className="text-muted-foreground mb-10 max-w-md">Your test has been evaluated by our AI. You can view detailed feedback and insights immediately.</p>

      <Card className="w-full max-w-sm mb-10 border-border/50 bg-secondary/20 overflow-hidden">
        <CardContent className="p-6">
            <div className="grid grid-cols-2 divide-x divide-border/50">
                <div className="text-center px-4">
                    <div className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-1">Score</div>
                    <div className="text-4xl font-bold text-primary">
                        {report.score}<span className="text-xl text-muted-foreground">/{report.total}</span>
                    </div>
                </div>
                <div className="text-center px-4">
                    <div className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-1">Result</div>
                    <div className="text-4xl font-bold text-primary">
                        {report.percentage}%
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          variant="outline"
          size="lg"
          onClick={onBackToDashboard}
          className="flex-1 h-12 gap-2"
        >
          <LayoutDashboard size={18} />
          Back to Dashboard
        </Button>
        <Button 
          size="lg"
          onClick={onViewReport}
          className="flex-1 h-12 gap-2 shadow-lg shadow-primary/20"
        >
          <FileBarChart size={18} />
          View Detailed Report
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default TestCompleted;
