"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { CourseCard } from "@/components/course/CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Search, BookOpen } from "lucide-react";

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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Course catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover courses and start learning
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["newest", "popular", "rating"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  sort === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data && data.courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((course) => (
              <CourseCard
                key={course.id}
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
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description={
              search
                ? `No courses match "${search}". Try a different search term.`
                : "No published courses yet. Check back soon!"
            }
          />
        )}

        {data && data.total > 20 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing 20 of {data.total} courses
          </div>
        )}
      </main>
    </div>
  );
}
