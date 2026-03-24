"use client";

import { trpc } from "@/lib/trpc/client";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = ((user as Record<string, unknown> | undefined)?.role as string) ?? "STUDENT";

  const { data: enrolledCourses, isLoading } = trpc.enrollment.myEnrollments.useQuery();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-6">
          <PageHeader
            title={`Welcome back, ${user?.name ?? "Student"}`}
            description="Continue learning where you left off"
          />

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">My enrolled courses</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : enrolledCourses && enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((e) => (
                  <div
                    key={e.enrollmentId}
                    className="rounded-xl border border-border/50 bg-card p-4"
                  >
                    <p className="text-sm font-medium">Course ID: {e.courseId}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                    </p>
                    {e.completedAt && (
                      <span className="mt-2 inline-block rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                        Completed ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No courses yet"
                description="Browse our catalog and enroll in a course to start learning."
                action={
                  <Link
                    href="/courses"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Browse courses
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
