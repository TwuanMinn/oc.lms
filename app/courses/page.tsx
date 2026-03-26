"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { CourseCard } from "@/components/course/CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Search, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, StaggerGrid, StaggerItem, ScrollReveal } from "@/components/ui/animated";
import { springBounce } from "@/lib/motion";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "popular" | "rating">("newest");

  const { data, isLoading } = trpc.course.list.useQuery({
    limit: 20,
    offset: 0,
    search: search || undefined,
    sort,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatedPage>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <ScrollReveal>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Course catalog</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover courses and start learning
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none ring-ring transition-shadow focus:ring-2 focus:shadow-lg focus:shadow-primary/5"
              />
            </div>

            <div className="flex items-center gap-2">
              {(["newest", "popular", "rating"] as const).map((s) => (
                <motion.button
                  key={s}
                  onClick={() => setSort(s)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={springBounce}
                  className={`relative cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    sort === s
                      ? "text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {sort === s && (
                    <motion.div
                      layoutId="sort-active"
                      className="absolute inset-0 rounded-md bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{s}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : data && data.courses.length > 0 ? (
              <StaggerGrid
                key="courses"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {data.courses.map((course) => (
                  <StaggerItem key={course.id} scale>
                    <CourseCard
                      id={course.id}
                      slug={course.slug}
                      title={course.title}
                      description={course.description}
                      thumbnail={course.thumbnail}
                      price={course.price}
                      totalDuration={course.totalDuration}
                      teacherName={course.teacherName}
                      categoryName={course.categoryName}
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <EmptyState
                  icon={BookOpen}
                  title="No courses found"
                  description={
                    search
                      ? `No courses match "${search}". Try a different search term.`
                      : "No published courses yet. Check back soon!"
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          {data && data.total > 20 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center text-sm text-muted-foreground"
            >
              Showing 20 of {data.total} courses
            </motion.div>
          )}
        </main>
      </AnimatedPage>
    </div>
  );
}
