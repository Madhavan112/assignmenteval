import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = { onCreate: (data: any) => Promise<void> };

export default function AssignmentForm({ onCreate }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    evaluationPrompt: "",
    maxMarks: 100,
    dueDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate.call(null, form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="space-y-1">
            <Label>Evaluation Prompt / Rubric</Label>
            <Textarea
              name="evaluationPrompt"
              value={form.evaluationPrompt}
              onChange={handleChange}
              placeholder="Instructions for Gemini evaluator"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label>Max Marks</Label>
              <Input name="maxMarks" value={String(form.maxMarks)} onChange={handleChange} type="number" />
            </div>
            <div className="flex-1 space-y-1">
              <Label>Due Date</Label>
              <Input name="dueDate" value={form.dueDate} onChange={handleChange} type="date" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
