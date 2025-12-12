import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Assignment = any;
type Props = {
  assignments: Assignment[];
  onView: (id: string) => void;
};

export default function AssignmentList({ assignments, onView }: Props) {
  return (
    <div className="space-y-3">
      {assignments.map((a) => (
        <Card key={a._id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">{a.title}</div>
              <div className="text-xs text-gray-500">
                Max: {a.maxMarks} {a.dueDate && `| Due: ${new Date(a.dueDate).toLocaleDateString()}`}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onView(a._id)}>View Submissions</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
