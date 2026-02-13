import React, { useEffect, useState } from "react";
import { getTopics, startTest } from "@/api/testApi";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle, BrainCircuit } from "lucide-react";

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

  const markTestTaken = (topicId: string) => {
    const updated = Array.from(new Set([...takenTests, topicId]));
    setTakenTests(updated);
    localStorage.setItem("takenTests", JSON.stringify(updated));
  };

  const handleStartWithMark = async (topicId: string) => {
    await handleStart(topicId);
    markTestTaken(topicId);
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
            <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse"></div>
        ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Available Tests</h2>
          <span className="text-sm text-muted-foreground">{topics.length} Tests</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => {
          const alreadyTaken = takenTests.includes(topic._id);
          return (
            <Card key={topic._id} className="card-hover border-border/50 flex flex-col h-full bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <BrainCircuit size={20} />
                    </div>
                    <CardTitle className="leading-tight">{topic.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                   {/* Spacing filler if needed */}
                </CardContent>
                <CardFooter className="pt-0">
                    <Button 
                        className={`w-full gap-2 ${alreadyTaken ? 'bg-muted text-muted-foreground hover:bg-muted' : ''}`}
                        onClick={() => handleStartWithMark(topic._id)}
                        disabled={alreadyTaken}
                        variant={alreadyTaken ? "ghost" : "default"}
                    >
                        {alreadyTaken ? (
                            <>
                                <CheckCircle size={16} />
                                <span>Test Completed</span>
                            </>
                        ) : (
                            <>
                                <PlayCircle size={16} />
                                <span>Start Test</span>
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TestList;
