"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc/client";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Brain,
} from "lucide-react";
import { springBounce } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  lessonId: string;
}

type Answers = Record<string, string[]>;

export function QuizPlayer({ lessonId }: QuizPlayerProps) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: quizMeta } = trpc.quiz.getByLessonId.useQuery({ lessonId });

  const {
    data: quiz,
    isLoading,
  } = trpc.quiz.getQuiz.useQuery(
    { quizId: quizMeta?.id ?? "" },
    { enabled: !!quizMeta?.id && started }
  );

  const submitMut = trpc.quiz.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const toggleOption = useCallback(
    (questionId: string, optionId: string, isMulti: boolean) => {
      setAnswers((prev) => {
        const current = prev[questionId] ?? [];
        if (isMulti) {
          const newSel = current.includes(optionId)
            ? current.filter((o) => o !== optionId)
            : [...current, optionId];
          return { ...prev, [questionId]: newSel };
        }
        return { ...prev, [questionId]: [optionId] };
      });
    },
    []
  );

  const handleSubmit = () => {
    if (!quiz) return;
    submitMut.mutate({
      quizId: quiz.id,
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptions: answers[q.id] ?? [],
      })),
    });
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQ(0);
    setSubmitted(false);
    submitMut.reset();
  };

  if (!quizMeta) return null;

  // Start screen
  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">{quizMeta.title}</h3>
            <p className="text-xs text-muted-foreground">
              Passing score: {quizMeta.passingScore}%
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => setStarted(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={springBounce}
          className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Start Quiz
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    );
  }

  if (isLoading || !quiz) {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 p-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading quiz...</span>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const progress = ((currentQ + 1) / totalQ) * 100;
  const allAnswered = quiz.questions.every((q) => (answers[q.id]?.length ?? 0) > 0);
  const feedback = submitMut.data?.feedback;
  const result = submitMut.data;

  // Results screen
  if (submitted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-6 rounded-xl border border-border/50 bg-card p-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              result.passed ? "bg-emerald-500/10" : "bg-rose-500/10"
            )}
          >
            {result.passed ? (
              <Trophy className="h-8 w-8 text-emerald-500" />
            ) : (
              <XCircle className="h-8 w-8 text-rose-500" />
            )}
          </motion.div>
          <h3 className="mt-4 text-xl font-bold">
            {result.passed ? "Congratulations! 🎉" : "Keep Learning!"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You scored {result.score}%
            {result.passed
              ? " — You passed the quiz!"
              : ` — You need ${quiz.passingScore}% to pass`}
          </p>

          {/* Score bar */}
          <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={cn(
                "h-full rounded-full",
                result.passed ? "bg-emerald-500" : "bg-rose-500"
              )}
            />
          </div>
        </div>

        {/* Per-question feedback */}
        <div className="mt-6 space-y-3">
          {quiz.questions.map((q, i) => {
            const fb = feedback?.find((f) => f.questionId === q.id);
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 text-sm",
                  fb?.correct
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-rose-500/20 bg-rose-500/5"
                )}
              >
                {fb?.correct ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                )}
                <div>
                  <p className="font-medium">Q{i + 1}: {q.text}</p>
                  {!fb?.correct && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Correct: {q.options
                        .filter((o) => fb?.correctOptions.includes(o.id))
                        .map((o) => o.text)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <motion.button
            onClick={handleRetry}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Question screen
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-xl border border-border/50 bg-card"
    >
      {/* Progress bar */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Question {currentQ + 1} of {totalQ}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-base font-bold leading-snug">{question.text}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {question.type === "MULTI"
                ? "Select all that apply"
                : "Select one answer"}
            </p>

            <div className="mt-4 space-y-2">
              {question.options.map((option) => {
                const isSelected = (answers[question.id] ?? []).includes(option.id);
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => toggleOption(question.id, option.id, question.type === "MULTI")}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border/50 text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={springBounce}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </motion.div>
                      )}
                    </div>
                    {option.text}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <motion.button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </motion.button>

          {currentQ < totalQ - 1 ? (
            <motion.button
              onClick={() => setCurrentQ((p) => Math.min(totalQ - 1, p + 1))}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!allAnswered || submitMut.isPending}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitMut.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Submit Quiz
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
