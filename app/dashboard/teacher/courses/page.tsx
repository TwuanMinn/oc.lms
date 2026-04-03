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
import { motion } from "motion/react";
import { AnimatedPage, StaggerGrid, StaggerItem, AnimatedShimmerButton } from "@/components/ui/animated";
import { springBounce } from "@/lib/motion";

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
          <AnimatedPage>
            <PageHeader
              title="My courses"
              description="Manage your courses"
              action={
                <AnimatedShimmerButton className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                  <Link
                    href="/dashboard/teacher/courses/new"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    New course
                  </Link>
                </AnimatedShimmerButton>
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
              <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: any) => (
                  <StaggerItem key={course.id} scale>
                    <Link
                      href={`/dashboard/teacher/courses/${course.id}`}
                    >
                      <motion.div
                        whileHover={{
                          y: -4,
                          boxShadow: "0 8px 24px rgba(225, 29, 72, 0.06)",
                          borderColor: "rgba(225, 29, 72, 0.3)",
                        }}
                        transition={springBounce}
                        className="group overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-colors"
                      >
                        {course.thumbnail ? (
                          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/5">
                            <BookOpen className="h-8 w-8 text-muted-foreground/30 transition-colors group-hover:text-primary/40" />
                          </div>
                        )}
                        <h3 className="text-sm font-bold line-clamp-2 transition-colors group-hover:text-primary">
                          {course.title}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span
                            className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              statusColors[course.status] ?? ""
                            }`}
                          >
                            {course.status}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <UsersIcon className="h-3.5 w-3.5" />
                            {course.enrollmentCount}
                          </div>
                        </div>
                        <div className="mt-3 border-t border-border/50 pt-3">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Created {formatDate(course.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <EmptyState
                  icon={BookOpen}
                  title="No courses created"
                  description="Create your first course and start teaching."
                  action={
                    <AnimatedShimmerButton className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                      <Link
                        href="/dashboard/teacher/courses/new"
                        className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Create course
                      </Link>
                    </AnimatedShimmerButton>
                  }
                />
              </motion.div>
            )}
          </div>
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
