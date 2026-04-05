"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { CompleteButton } from "@/components/lesson/CompleteButton";
import { BookmarkButton } from "@/components/lesson/BookmarkButton";
import { MarkdownContent } from "@/components/lesson/MarkdownContent";
import { QuizBlock } from "@/components/quiz/QuizBlock";
import { Loader2, ChevronLeft, ChevronRight, Trophy, Star, X, BookOpen, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function LearningPlayerPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewBody, setReviewBody] = useState("");

  const { data: course } = trpc.course.bySlug.useQuery({ slug: params.slug });
  const { data: lesson, isLoading } = trpc.lesson.byId.useQuery({
    id: params.lessonId,
  });
  const { data: completedLessons } = trpc.progress.getCompletedLessons.useQuery(
    { courseId: course?.id ?? "" },
    { enabled: !!course?.id }
  );
  const { data: quiz } = trpc.quiz.getByLessonId.useQuery(
    { lessonId: params.lessonId },
    { enabled: !!params.lessonId }
  );

  const submitReview = trpc.review.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted! Thank you 🎉");
      setShowCompleteModal(false);
    },
    onError: (err: { message: string }) => toast.error(err.message),
  });

  const isLessonCompleted = completedLessons?.includes(params.lessonId) ?? false;

  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((mod: { lessons: { id: string; title: string }[] }) => mod.lessons);
  }, [course]);

  const currentIndex = allLessons.findIndex((l: { id: string }) => l.id === params.lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isLastLesson = currentIndex === allLessons.length - 1;

  const totalLessons = allLessons.length;
  const completedCount = completedLessons?.length ?? 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const navigateToLesson = useCallback(
    (lessonId: string) => {
      router.push(`/learn/${params.slug}/${lessonId}`);
    },
    [router, params.slug]
  );

  useEffect(() => {
    if (isLastLesson && completedCount === totalLessons && totalLessons > 0) {
      setShowCompleteModal(true);
    }
  }, [isLastLesson, completedCount, totalLessons]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" && prevLesson) navigateToLesson(prevLesson.id);
      else if (e.key === "ArrowRight" && nextLesson) navigateToLesson(nextLesson.id);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevLesson, nextLesson, navigateToLesson]);

  if (isLoading || !course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* ─── Top Progress Bar ─── */}
      <div className="relative h-1 w-full bg-muted shrink-0">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-primary"
        />
      </div>

      {/* ─── Main Layout ─── */}
      <div className="flex flex-1 overflow-hidden">
        <LessonSidebar
          courseSlug={course.slug}
          modules={course.modules}
          currentLessonId={params.lessonId}
          completedLessonIds={completedLessons ?? []}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {lesson && (
              <motion.div
                key={params.lessonId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="mx-auto max-w-4xl px-6 py-6"
              >
                <VideoPlayer url={lesson.videoUrl} />

                {/* Lesson header */}
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        <BookOpen className="mr-1.5 h-3 w-3" />
                        Lesson {currentIndex + 1} of {totalLessons}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {progressPercentage}% complete
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      {lesson.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <BookmarkButton lessonId={lesson.id} />
                    <CompleteButton
                      courseId={course.id}
                      lessonId={lesson.id}
                      isCompleted={isLessonCompleted}
                    />
                  </div>
                </div>

                {lesson.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {lesson.description}
                  </p>
                )}

                {lesson.content && (
                  <div className="mt-8 prose-smooth">
                    <MarkdownContent content={lesson.content} />
                  </div>
                )}

                {quiz && <QuizBlock quizId={quiz.id} />}

                {/* ─── Prev / Next Navigation ─── */}
                <div className="mt-10 flex items-stretch justify-between gap-4 border-t border-border/40 pt-6">
                  {prevLesson ? (
                    <motion.button
                      onClick={() => navigateToLesson(prevLesson.id)}
                      whileHover={{ x: -2 }}
                      className="flex flex-col items-start gap-1 rounded-xl border border-border/50 px-5 py-3 text-left transition-colors hover:bg-accent/30 hover:border-primary/20 min-w-0 max-w-[45%]"
                    >
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <ChevronLeft className="h-3 w-3" /> Previous
                      </span>
                      <span className="text-sm font-medium truncate w-full">{prevLesson.title}</span>
                    </motion.button>
                  ) : (
                    <div />
                  )}
                  {nextLesson ? (
                    <motion.button
                      onClick={() => navigateToLesson(nextLesson.id)}
                      whileHover={{ x: 2 }}
                      className="flex flex-col items-end gap-1 rounded-xl bg-primary/5 border border-primary/20 px-5 py-3 text-right transition-colors hover:bg-primary/10 min-w-0 max-w-[45%]"
                    >
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Next <ChevronRight className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium truncate w-full">{nextLesson.title}</span>
                    </motion.button>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Keyboard hint */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/40">
                  <Keyboard className="h-3 w-3" />
                  <span>← → to navigate · Space to complete</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Course Complete Modal ─── */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowCompleteModal(false)}
                className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
              >
                <Trophy className="h-10 w-10 text-primary" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 text-2xl font-bold"
              >
                Course Complete! 🎉
              </motion.h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Congratulations! You&apos;ve finished all lessons in this course.
              </p>

              <div className="mt-6">
                <p className="text-sm font-medium">Rate this course</p>
                <div className="mt-2 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className="rounded-md p-1 transition-colors hover:bg-accent/30"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Share your experience (optional)..."
                rows={3}
                className="mt-4 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2"
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/30 transition-colors"
                >
                  Skip
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (rating > 0 && course) {
                      submitReview.mutate({
                        courseId: course.id,
                        rating,
                        body: reviewBody || undefined,
                      });
                    } else {
                      setShowCompleteModal(false);
                    }
                  }}
                  disabled={rating === 0 || submitReview.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
                >
                  {submitReview.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit review
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
