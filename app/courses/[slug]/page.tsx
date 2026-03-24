"use client";

import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { RatingStars } from "@/components/course/RatingStars";
import { ReviewSection } from "@/components/course/ReviewSection";
import { formatDuration, formatDate } from "@/lib/utils";
import { Clock, Users, BookOpen, PlayCircle, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const { data: course, isLoading } = trpc.course.bySlug.useQuery({
    slug: params.slug,
  });

  const utils = trpc.useUtils();
  const enroll = trpc.enrollment.enroll.useMutation({
    onSuccess: () => {
      utils.course.bySlug.invalidate({ slug: params.slug });
      toast.success("Enrolled successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );
  const isFree = !course.price || course.price === "0" || course.price === "0.00";

  function handleEnroll() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/courses/${params.slug}`);
      return;
    }
    enroll.mutate({ courseId: course!.id });
  }

  function handleStartLearning() {
    const firstLesson = course!.modules[0]?.lessons[0];
    if (firstLesson) {
      router.push(`/learn/${course!.slug}/${firstLesson.id}`);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {course.categoryName && (
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {course.categoryName}
                </span>
              )}
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {course.title}
              </h1>
              {course.description && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={course.avgRating} size="sm" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {course.enrollmentCount} students
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {totalLessons} lessons
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDuration(course.totalDuration)}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                  {course.teacherAvatar ? (
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacherName ?? ""}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    course.teacherName?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{course.teacherName}</p>
                  {course.teacherBio && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {course.teacherBio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-xs rounded-xl border border-border/50 bg-card p-6">
                {course.thumbnail && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-2xl font-bold">
                  {isFree ? "Free" : `$${course.price}`}
                </div>
                {course.isEnrolled ? (
                  <button
                    onClick={handleStartLearning}
                    className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enroll.isPending}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {enroll.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {isFree ? "Enroll for free" : `Enroll — $${course.price}`}
                  </button>
                )}
                <p className="mt-3 text-center text-[10px] text-muted-foreground">
                  Updated {formatDate(course.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold">Curriculum</h2>
            <div className="mt-4 space-y-4">
              {course.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-xl border border-border/50 bg-card"
                >
                  <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                    <h3 className="text-sm font-semibold">{mod.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {mod.lessons.length} lessons
                    </span>
                  </div>
                  <div className="divide-y divide-border/30">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.isFree || course.isEnrolled ? (
                            <PlayCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{lesson.title}</span>
                          {lesson.isFree && !course.isEnrolled && (
                            <span className="rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success">
                              FREE
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold">Reviews</h2>
              <div className="mt-4">
                <ReviewSection courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
