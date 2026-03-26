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
import { motion } from "motion/react";
import { AnimatedPage, StaggerGrid, StaggerItem } from "@/components/ui/animated";
import { springBounce } from "@/lib/motion";

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
          <AnimatedPage>
            <PageHeader
              title={`Welcome back, ${user?.name ?? "Student"}`}
              description="Continue learning where you left off"
            />

            <div className="mt-8">
              <motion.h2
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-lg font-semibold"
              >
                My enrolled courses
              </motion.h2>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : enrolledCourses && enrolledCourses.length > 0 ? (
                <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((e) => (
                    <StaggerItem key={e.enrollmentId} scale>
                      <motion.div
                        whileHover={{
                          y: -4,
                          boxShadow: "0 8px 24px rgba(225, 29, 72, 0.06)",
                          borderColor: "rgba(225, 29, 72, 0.3)",
                        }}
                        transition={springBounce}
                        className="cursor-pointer rounded-xl border border-border/50 bg-card p-4 transition-colors"
                      >
                        <p className="text-sm font-medium">Course ID: {e.courseId}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                        </p>
                        {e.completedAt && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="mt-2 inline-block rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500"
                          >
                            Completed ✓
                          </motion.span>
                        )}
                      </motion.div>
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
                    title="No courses yet"
                    description="Browse our catalog and enroll in a course to start learning."
                    action={
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Link
                          href="/courses"
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Browse courses
                        </Link>
                      </motion.div>
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
