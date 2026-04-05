"use client";

import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { SkeletonDashboardHero } from "@/components/shared/SkeletonCard";
import {
  BookOpen,
  Users,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { AnimatedPage, StaggerGrid, StaggerItem, AnimatedShimmerButton } from "@/components/ui/animated";
import { springBounce } from "@/lib/motion";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading } = trpc.course.myCoursesAsTeacher.useQuery();

  const totalCourses = courses?.length ?? 0;
  const publishedCourses = courses?.filter((c: any) => c.status === "PUBLISHED").length ?? 0;
  const draftCourses = courses?.filter((c: any) => c.status === "DRAFT").length ?? 0;
  const totalStudents = courses?.reduce((sum: number, c: any) => sum + (c.enrollmentCount ?? 0), 0) ?? 0;
  const topCourse = courses?.reduce((best: any, c: any) =>
    (!best || (c.enrollmentCount ?? 0) > (best.enrollmentCount ?? 0)) ? c : best, null as any);

  const stats = [
    { label: "Total Courses", value: totalCourses, icon: BookOpen, color: "bg-sky-500/10 text-sky-500", accent: "sky" },
    { label: "Published", value: publishedCourses, icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-500", accent: "emerald" },
    { label: "Drafts", value: draftCourses, icon: BarChart3, color: "bg-amber-500/10 text-amber-500", accent: "amber" },
    { label: "Total Students", value: totalStudents, icon: Users, color: "bg-rose-500/10 text-rose-500", accent: "rose" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="TEACHER" />
        <main className="flex-1 p-6">
          <AnimatedPage>
            {/* ─── Welcome Hero Banner ─── */}
            {isLoading ? (
              <SkeletonDashboardHero />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-background to-primary/10 p-6 sm:p-8"
              >
                {/* Background glow */}
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-[80px]" />
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-500/5 blur-[60px]" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-2xl"
                      >
                        🎓
                      </motion.span>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        Instructor Studio
                      </p>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      Welcome, {user?.name ?? "Teacher"}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">
                      You have <span className="font-semibold text-foreground">{publishedCourses}</span> published course{publishedCourses !== 1 ? "s" : ""} with <span className="font-semibold text-foreground">{totalStudents}</span> total student{totalStudents !== 1 ? "s" : ""} enrolled.
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/dashboard/teacher/courses/new"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                    >
                      <Plus className="h-4 w-4" />
                      Create course
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ─── Stat Cards ─── */}
            <StaggerGrid className="mt-6 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <StaggerItem key={i} scale>
                  <motion.div
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* ─── Most Popular Course Spotlight ─── */}
            {topCourse && topCourse.enrollmentCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Most Popular Course
                </h2>
                <Link href={`/dashboard/teacher/courses/${topCourse.id}`}>
                  <motion.div
                    whileHover={{ y: -2, borderColor: "rgba(225, 29, 72, 0.3)" }}
                    transition={springBounce}
                    className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 shadow-lg shadow-amber-500/5">
                        <GraduationCap className="h-7 w-7 text-amber-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold group-hover:text-primary transition-colors">{topCourse.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {topCourse.enrollmentCount} student{topCourse.enrollmentCount !== 1 ? "s" : ""} enrolled
                        </p>
                      </div>
                    </div>
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )}

            {/* ─── Quick Actions ─── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Create New Course", description: "Build and publish a new course", href: "/dashboard/teacher/courses/new", icon: Plus, color: "bg-emerald-500/10 text-emerald-500" },
                  { label: "Manage Courses", description: "Edit, update, or archive existing courses", href: "/dashboard/teacher/courses", icon: BookOpen, color: "bg-sky-500/10 text-sky-500" },
                  { label: "View Analytics", description: "Track enrollment and student progress", href: "/dashboard/teacher/courses", icon: BarChart3, color: "bg-rose-500/10 text-rose-500" },
                ].map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Link href={action.href}>
                      <motion.div
                        whileHover={{ y: -2, borderColor: "rgba(225, 29, 72, 0.2)" }}
                        transition={springBounce}
                        className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-sm"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors">{action.label}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
