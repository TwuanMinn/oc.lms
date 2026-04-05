"use client";

import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { BookOpen, PlayCircle, Clock, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { AnimatedPage, StaggerGrid, StaggerItem, AnimatedShimmerButton } from "@/components/ui/animated";
import { springBounce } from "@/lib/motion";
import { formatDate } from "@/lib/utils";

export default function StudentDashboard() {
  const { user, role } = useAuth();

  const {
    data: enrolledCourses,
    isLoading,
    isError,
    refetch,
  } = trpc.enrollment.myEnrollments.useQuery();

  const activeCourses = enrolledCourses?.filter((e) => !e.completedAt) ?? [];
  const completedCourses = enrolledCourses?.filter((e) => e.completedAt) ?? [];
  const lastActive = activeCourses[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-6">
          <AnimatedPage>
            {/* ─── Welcome Hero Banner ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-background to-primary/10 p-6 sm:p-8"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-[80px]" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-rose-500/5 blur-[60px]" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl"
                    >
                      👋
                    </motion.span>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Welcome back
                    </p>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {user?.name ?? "Student"}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
                    <span className="ml-1 text-xs text-muted-foreground/60">— B.B. King</span>
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                  >
                    <BookOpen className="h-4 w-4" />
                    Explore courses
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Dashboard Overview Metrics */}
            <StaggerGrid className="mt-6 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Active Courses", value: activeCourses.length.toString(), icon: BookOpen, color: "bg-sky-500/10 text-sky-500" },
                { label: "Completed", value: completedCourses.length.toString(), icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-500" },
                { label: "Certificates", value: "0", icon: Award, color: "bg-amber-500/10 text-amber-500" }
              ].map((stat, i) => (
                <StaggerItem key={i} scale>
                  <motion.div
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all"
                  >
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* Continue where you left off */}
            {lastActive && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6"
              >
                <Link
                  href={`/courses/${lastActive.courseSlug ?? lastActive.courseId}`}
                  className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-primary/20 bg-background p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Subtle moving gradient background */}
                  <motion.div 
                     animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                     transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 -z-10 bg-[linear-gradient(270deg,rgba(225,29,72,0.02),rgba(225,29,72,0.08),rgba(225,29,72,0.02))] bg-[length:200%_200%]" 
                  />
                  
                  <div className="flex items-center gap-5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20"
                    >
                      <PlayCircle className="h-7 w-7 text-primary-foreground" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        Jump back in
                      </p>
                      <p className="mt-1 truncate text-lg font-bold">
                        {lastActive.courseTitle ?? `Course ${lastActive.courseId.slice(0, 8)}...`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className="mt-8">
              <motion.h2
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-lg font-semibold"
              >
                My enrolled courses
                {enrolledCourses && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({enrolledCourses.length})
                  </span>
                )}
              </motion.h2>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : isError ? (
                <ErrorState
                  title="Couldn't load your courses"
                  description="There was a problem fetching your enrollments. Please try again."
                  onRetry={() => refetch()}
                />
              ) : enrolledCourses && enrolledCourses.length > 0 ? (
                <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((e) => (
                    <StaggerItem key={e.enrollmentId} scale>
                      <Link href={`/courses/${e.courseSlug ?? e.courseId}`}>
                        <motion.div
                          whileHover={{
                            y: -4,
                            boxShadow: "0 8px 24px rgba(225, 29, 72, 0.06)",
                            borderColor: "rgba(225, 29, 72, 0.3)",
                          }}
                          transition={springBounce}
                          className="cursor-pointer rounded-xl border border-border/50 bg-card p-4 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {e.courseTitle ?? `Course ${e.courseId.slice(0, 8)}...`}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Enrolled {formatDate(e.enrolledAt)}</span>
                              </div>
                            </div>
                            {e.completedAt && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                className="ml-2 shrink-0 rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500"
                              >
                                Completed ✓
                              </motion.span>
                            )}
                          </div>
                          {!e.completedAt && (
                            <div className="mt-3 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(e as Record<string, unknown>).progressPercent ?? 0}%` }}
                                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                  className="h-full rounded-full bg-primary"
                                />
                              </div>
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {(e as Record<string, unknown>).progressPercent ?? 0}%
                              </span>
                            </div>
                          )}
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
                    title="No courses yet"
                    description="Browse our catalog and enroll in a course to start learning."
                    action={
                      <AnimatedShimmerButton className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                        <Link
                          href="/courses"
                          className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Browse courses
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
