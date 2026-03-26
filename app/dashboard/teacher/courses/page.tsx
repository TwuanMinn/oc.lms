"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { BookOpen, Plus, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export default function TeacherCoursesPage() {
  const { data: courses, isLoading } = trpc.course.myCoursesAsTeacher.useQuery();

  const statusColors: Record<string, string> = {
    DRAFT: "bg-amber-500/10 text-amber-500",
    PUBLISHED: "bg-green-500/10 text-green-500",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6">
          <PageHeader
            title="My courses"
            description="Manage your courses"
            action={
              <Link
                href="/dashboard/teacher/courses/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New course
              </Link>
            }
          />

          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: { id: string; title: string; thumbnail?: string | null; status: string; enrollmentCount: number; createdAt: string }) => (
                  <Link
                    key={course.id}
                    href={`/dashboard/teacher/courses/${course.id}`}
                    className="group rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {course.thumbnail ? (
                      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-3 flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
                        <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
                          statusColors[course.status] ?? ""
                        }`}
                      >
                        {course.status}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <UsersIcon className="h-3 w-3" />
                        {course.enrollmentCount}
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {formatDate(course.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No courses created"
                description="Create your first course and start teaching."
                action={
                  <Link
                    href="/dashboard/teacher/courses/new"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Create course
                  </Link>
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
