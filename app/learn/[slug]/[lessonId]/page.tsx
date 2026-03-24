"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { CompleteButton } from "@/components/lesson/CompleteButton";
import { BookmarkButton } from "@/components/lesson/BookmarkButton";
import { MarkdownContent } from "@/components/lesson/MarkdownContent";
import { QuizBlock } from "@/components/quiz/QuizBlock";
import { Loader2 } from "lucide-react";

export default function LearningPlayerPage() {
  const params = useParams<{ slug: string; lessonId: string }>();

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

  const isLessonCompleted = completedLessons?.includes(params.lessonId) ?? false;

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
          </div>
        )}
      </main>
    </div>
  );
}
