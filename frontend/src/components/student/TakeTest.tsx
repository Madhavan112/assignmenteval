import React, { useState } from "react";
import { submitTest } from "@/api/testApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

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
    
    if (answers.some(a => !a)) {
        toast.error("Please answer all questions before submitting.");
        return;
    }

    setSubmitting(true);
    try {
      const res = await submitTest(test._id, answers);
      // Handle axios response structure
      const report = res.data?.report; 
      if (onTestSubmitted && report) {
        onTestSubmitted(report);
      } else {
        console.error("No report found in response", res);
        toast.error("Submission successful but report missing.");
      }
    } catch (err) {
      console.error("Failed to submit test", err);
      toast.error("Failed to submit test. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold font-heading">Test: {test.topic.title}</h2>
            <p className="text-muted-foreground">Answer all questions to complete the test.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm">
            {test.mcqs.length} Questions
        </div>
      </div>
      
      {test.mcqs.map((mcq, idx) => (
        <Card key={mcq._id} className="border-border/50 shadow-sm overflow-hidden">
           <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
               <CardTitle className="text-base font-medium flex gap-3 leading-relaxed">
                   <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                       {idx + 1}
                   </span>
                   {mcq.question}
               </CardTitle>
           </CardHeader>
           <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-3">
                  {mcq.options.map((opt, oidx) => (
                    <label 
                        key={oidx} 
                        className={`
                            relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${answers[idx] === opt 
                                ? 'border-primary bg-primary/5 shadow-inner' 
                                : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'}
                        `}
                    >
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleChange(idx, opt)}
                        required
                        className="sr-only"
                      />
                      <div className={`
                          w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                          ${answers[idx] === opt ? 'border-primary' : 'border-muted-foreground/30'}
                      `}>
                          {answers[idx] === opt && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className={`${answers[idx] === opt ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {opt}
                      </span>
                      
                      {answers[idx] === opt && <CheckCircle2 className="absolute right-4 text-primary ml-auto" size={20} />}
                    </label>
                  ))}
              </div>
           </CardContent>
        </Card>
      ))}
      
      <div className="sticky bottom-4 z-10 pt-4 pb-2">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full shadow-xl shadow-primary/20 text-lg h-14 rounded-xl"
            disabled={submitting}
          >
            {submitting ? (
                <>Submitting...</>
            ) : (
                <>Submit Test <ChevronRight className="ml-2" /></>
            )}
          </Button>
      </div>
    </form>
  );
};

export default TakeTest;
