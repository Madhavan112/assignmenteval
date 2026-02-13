import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, BrainCircuit, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const TestReport = ({ report, onBack }: { report: any, onBack?: () => void }) => {
  if (!report) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground">Test Report</h2>
           <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              {report.student?.name && <span className="font-medium text-foreground">{report.student.name}</span>}
              <span>•</span>
              {report.topic?.title && <span>{report.topic.title}</span>}
           </div>
        </div>
        
        {onBack && (
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft size={16} /> Back to List
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-1">{report.score} <span className="text-2xl text-muted-foreground">/ {report.total}</span></div>
                <div className="text-xs uppercase tracking-wider font-bold text-primary/70">Total Score</div>
            </CardContent>
        </Card>
        <Card className="bg-violet-500/5 border-violet-500/20">
            <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-1">{report.percentage}%</div>
                <div className="text-xs uppercase tracking-wider font-bold text-violet-600/70 dark:text-violet-400/70">Performance</div>
            </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    {report.details.filter((d: any) => d.isCorrect).length}
                </div>
                <div className="text-xs uppercase tracking-wider font-bold text-emerald-600/70 dark:text-emerald-400/70">Correct Answers</div>
            </CardContent>
        </Card>
      </div>

      {report.analysis && (
        <Card className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900 overflow-hidden">
          <CardHeader className="border-b border-indigo-100 dark:border-indigo-900 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <BrainCircuit size={24} /> AI Performance Analysis
              </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
             <div className="text-lg text-indigo-900 dark:text-indigo-100 leading-relaxed font-medium">
                {report.analysis.summary}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400 text-lg">
                        <TrendingUp size={20} /> Strengths
                    </h4>
                    <ul className="space-y-2">
                        {report.analysis.strengths.map((s: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-indigo-900/80 dark:text-indigo-100/80 bg-white/60 dark:bg-black/20 p-2 rounded-lg text-sm">
                            <span className="text-emerald-500 mt-0.5">•</span> {s}
                          </li>
                        ))}
                    </ul>
                 </div>
                 
                 <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 text-lg">
                        <AlertTriangle size={20} /> Area for Improvement
                    </h4>
                    <ul className="space-y-2">
                        {report.analysis.weaknesses.map((w: string, idx: number) => (
                           <li key={idx} className="flex gap-2 text-indigo-900/80 dark:text-indigo-100/80 bg-white/60 dark:bg-black/20 p-2 rounded-lg text-sm">
                            <span className="text-amber-500 mt-0.5">•</span> {w}
                          </li>
                        ))}
                    </ul>
                 </div>
             </div>

             {report.analysis.improvementTips?.length > 0 && (
                <div className="bg-blue-500/10 rounded-xl p-5 border border-blue-500/20">
                     <h4 className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400 text-lg mb-3">
                        <Lightbulb size={20} /> Tips for Improvement
                     </h4>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {report.analysis.improvementTips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                            <span className="text-blue-500 font-bold">•</span> {tip}
                          </li>
                        ))}
                     </ul>
                </div>
             )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
          <h3 className="text-xl font-bold font-heading">Detailed Analysis</h3>
          <div className="space-y-4">
            {report.details.map((item: any, idx: number) => (
              <Card key={idx} className={`border-l-4 ${item.isCorrect ? "border-l-emerald-500" : "border-l-rose-500"}`}>
                 <CardContent className="p-5 flex gap-4">
                     <div className="flex-shrink-0">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${item.isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                             {item.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                         </div>
                     </div>
                     <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question {idx + 1}</span>
                             {!item.isCorrect && <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-medium">Incorrect</span>}
                         </div>
                         <p className="font-heading font-semibold text-lg mb-4 text-foreground/90">{item.question}</p>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-3 rounded-lg border ${item.isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"}`}>
                                <div className="text-xs font-semibold uppercase mb-1 opacity-70">Your Answer</div>
                                <div className={`font-medium ${item.isCorrect ? "text-emerald-700" : "text-rose-700"}`}>{item.yourAnswer}</div>
                            </div>
                            
                            <div className="p-3 rounded-lg border border-border bg-secondary/20">
                                <div className="text-xs font-semibold uppercase mb-1 opacity-70">Correct Answer</div>
                                <div className="font-medium text-foreground">{item.correctAnswer}</div>
                            </div>
                         </div>
                     </div>
                 </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </div>
  );
};

export default TestReport;
