"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface QuizBlockProps {
  quizId: string;
}

export function QuizBlock({ quizId }: QuizBlockProps) {
  const { data: quiz, isLoading } = trpc.quiz.getQuiz.useQuery({ quizId });

  const [answers, setAnswers] = useState<
    Map<string, string[]>
  >(new Map());
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    feedback: Array<{
      questionId: string;
      correct: boolean;
      correctOptions: string[];
    }>;
  } | null>(null);

  const submit = trpc.quiz.submit.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (data.passed) {
        toast.success(`Passed with ${data.score}%!`);
      } else {
        toast.error(`Score: ${data.score}%. Try again!`);
      }
    },
    onError: () => {
      toast.error("Failed to submit quiz");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!quiz) return null;

  function handleOptionChange(questionId: string, optionId: string, type: string) {
    setAnswers((prev) => {
      const next = new Map(prev);
      if (type === "MCQ") {
        next.set(questionId, [optionId]);
      } else {
        const current = next.get(questionId) ?? [];
        if (current.includes(optionId)) {
          next.set(
            questionId,
            current.filter((id) => id !== optionId)
          );
        } else {
          next.set(questionId, [...current, optionId]);
        }
      }
      return next;
    });
  }

  function handleSubmit() {
    const answerArray = Array.from(answers.entries()).map(
      ([questionId, selectedOptions]) => ({
        questionId,
        selectedOptions,
      })
    );
    submit.mutate({ quizId, answers: answerArray });
  }

  function handleRetry() {
    setResult(null);
    setAnswers(new Map());
  }

  const feedbackMap = result
    ? new Map(result.feedback.map((f) => [f.questionId, f]))
    : null;

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">{quiz.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Passing score: {quiz.passingScore}%
      </p>

      <div className="mt-6 space-y-6">
        {quiz.questions.map((q, idx) => {
          const fb = feedbackMap?.get(q.id);
          return (
            <div key={q.id} className="space-y-3">
              <p className="text-sm font-medium">
                {idx + 1}. {q.text}
              </p>
              <div className="space-y-2 pl-4">
                {q.options.map((opt) => {
                  const selected = answers.get(q.id)?.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all",
                        selected
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:border-foreground/20",
                        result && "cursor-default"
                      )}
                    >
                      <input
                        type={q.type === "MCQ" ? "radio" : "checkbox"}
                        name={q.id}
                        checked={selected ?? false}
                        disabled={!!result}
                        onChange={() =>
                          handleOptionChange(q.id, opt.id, q.type)
                        }
                        className="accent-primary"
                      />
                      <span>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
              {fb && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium",
                    fb.correct
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {fb.correct ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {fb.correct ? "Correct!" : "Incorrect"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "mt-6 rounded-lg p-4",
              result.passed
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            <p className="text-lg font-bold">
              {result.passed ? "🎉 Passed!" : "❌ Not passed"}
            </p>
            <p className="text-sm">Score: {result.score}%</p>
            {!result.passed && (
              <button
                onClick={handleRetry}
                className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Retry
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={submit.isPending || answers.size === 0}
          className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit
        </button>
      )}
    </div>
  );
}
