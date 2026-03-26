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
import { Loader2, ChevronLeft, ChevronRight, Trophy, Star, X } from "lucide-react";
import { toast } from "sonner";

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

  // Flatten all lessons for prev/next navigation
  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((mod: { lessons: { id: string; title: string }[] }) => mod.lessons);
  }, [course]);

  const currentIndex = allLessons.findIndex((l: { id: string }) => l.id === params.lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isLastLesson = currentIndex === allLessons.length - 1;

  const navigateToLesson = useCallback(
    (lessonId: string) => {
      router.push(`/learn/${params.slug}/${lessonId}`);
    },
    [router, params.slug]
  );

  // Check if course is fully completed after marking last lesson
  const totalLessons = allLessons.length;
  const completedCount = completedLessons?.length ?? 0;

  useEffect(() => {
    if (isLastLesson && completedCount === totalLessons && totalLessons > 0) {
      setShowCompleteModal(true);
    }
  }, [isLastLesson, completedCount, totalLessons]);

  // Keyboard navigation: ← → for prev/next lesson
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft" && prevLesson) {
        navigateToLesson(prevLesson.id);
      } else if (e.key === "ArrowRight" && nextLesson) {
        navigateToLesson(nextLesson.id);
      }
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
    <div className="flex h-screen">
      <LessonSidebar
        courseSlug={course.slug}
        modules={course.modules}
        currentLessonId={params.lessonId}
        completedLessonIds={completedLessons ?? []}
      />

      <main className="flex-1 overflow-y-auto">
        {lesson && (
          <div className="mx-auto max-w-4xl px-6 py-6">
            <VideoPlayer url={lesson.videoUrl} />

            <div className="mt-6 flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-2">
                <BookmarkButton lessonId={lesson.id} />
                <CompleteButton
                  courseId={course.id}
                  lessonId={lesson.id}
                  isCompleted={isLessonCompleted}
                />
              </div>
            </div>

            {lesson.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {lesson.description}
              </p>
            )}

            {lesson.content && (
              <div className="mt-6">
                <MarkdownContent content={lesson.content} />
              </div>
            )}

            {quiz && <QuizBlock quizId={quiz.id} />}

            {/* Prev / Next nav */}
            <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4">
              {prevLesson ? (
                <button
                  onClick={() => navigateToLesson(prevLesson.id)}
                  className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <button
                  onClick={() => navigateToLesson(nextLesson.id)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Keyboard hint */}
            <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
              Use ← → arrow keys to navigate lessons
            </p>
          </div>
        )}
      </main>

      {/* Course Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowCompleteModal(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-8 w-8 text-primary" />
            </div>

            <h2 className="mt-4 text-2xl font-bold">Course Complete! 🎉</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Congratulations! You&apos;ve finished all lessons in this course.
            </p>

            <div className="mt-6">
              <p className="text-sm font-medium">Rate this course</p>
              <div className="mt-2 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="rounded-md p-1 transition-colors hover:bg-accent/30"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows={3}
              className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/30"
              >
                Skip
              </button>
              <button
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
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {submitReview.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
