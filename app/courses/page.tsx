"use client";

import { useState, useRef, useEffect } from "react";

import { trpc } from "@/lib/trpc/client";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Navbar } from "@/components/layout/Navbar";
import { CourseCard } from "@/components/course/CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Footer } from "@/components/layout/Footer";
import { Search, BookOpen, Filter, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, StaggerGrid, StaggerItem } from "@/components/ui/animated";
import { springBounce } from "@/lib/motion";

const PAGE_SIZE = 20;

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "popular" | "rating">("newest");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: categories } = trpc.course.categories.useQuery();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = trpc.course.list.useQuery({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    search: debouncedSearch || undefined,
    sort,
    categoryId: category || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AnimatedPage>
        <div className="mx-auto flex max-w-[1400px] flex-1 gap-6 px-4 py-8 sm:px-6">
          {/* Pricing sidebar (left) */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Category Filter */}
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${!category ? "border-primary bg-primary" : "border-border/50 bg-background group-hover:border-primary/50"}`}>
                      {!category && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className={`text-sm ${!category ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                      All Courses
                    </span>
                    <input type="radio" className="hidden" checked={!category} onChange={() => { setCategory(""); setPage(0); }} />
                  </label>
                  {categories?.map((cat: { id: string; name: string }) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${category === cat.id ? "border-primary bg-primary" : "border-border/50 bg-background group-hover:border-primary/50"}`}>
                        {category === cat.id && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className={`text-sm ${category === cat.id ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                        {cat.name}
                      </span>
                      <input type="radio" className="hidden" checked={category === cat.id} onChange={() => { setCategory(cat.id); setPage(0); }} />
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">
            {/* ─── Hero Header ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-background to-primary/10 p-6 sm:p-8"
            >
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-[80px]" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-500/5 blur-[60px]" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <motion.span
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-xl"
                  >
                    📚
                  </motion.span>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Explore & Learn
                  </p>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Course Catalog
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                  Discover {data?.total ?? "..."} courses from expert instructors. Filter by category, search by topic, or browse what&apos;s trending.
                </p>

                {/* Category chips (Mobile Only) */}
                {categories && categories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-4 flex flex-wrap gap-2 lg:hidden"
                  >
                    <button
                      onClick={() => { setCategory(""); setPage(0); }}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        !category
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat: { id: string; name: string }) => (
                      <button
                        key={cat.id}
                        onClick={() => { setCategory(cat.id); setPage(0); }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                          category === cat.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                    className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none ring-ring transition-shadow focus:ring-2 focus:shadow-lg focus:shadow-primary/5"
                  />
                </div>

                {categories && categories.length > 0 && (
                  <div className="relative lg:hidden" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 rounded-lg border border-input bg-background py-2 pl-3 pr-4 text-sm outline-none ring-ring transition-all hover:bg-accent focus:ring-2 focus:shadow-lg focus:shadow-primary/5"
                    >
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{category ? categories.find((c: { id: string; name: string }) => c.id === category)?.name : "All categories"}</span>
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-border/50 bg-popover p-1.5 shadow-xl backdrop-blur-md"
                        >
                          <button
                            onClick={() => { setCategory(""); setIsDropdownOpen(false); setPage(0); }}
                            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${!category ? "bg-accent/50 text-foreground" : "text-muted-foreground"}`}
                          >
                            All categories
                          </button>
                          {categories.map((cat: { id: string; name: string }) => (
                            <button
                              key={cat.id}
                              onClick={() => { setCategory(cat.id); setIsDropdownOpen(false); setPage(0); }}
                              className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${category === cat.id ? "bg-accent/50 text-foreground" : "text-muted-foreground"}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(["newest", "popular", "rating"] as const).map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => {
                      setSort(s);
                      setPage(0);
                    }}
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
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ErrorState
                    title="Couldn't load courses"
                    description="There was a problem fetching courses. This may be a temporary issue."
                    onRetry={() => refetch()}
                  />
                </motion.div>
              ) : data && data.courses.length > 0 ? (
                <div key="courses">
                  <StaggerGrid
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                  >
                    {data.courses.map((course) => (
                      <StaggerItem key={course.id} scale>
                        <CourseCard
                          id={course.id}
                          slug={course.slug}
                          title={course.title}
                          description={course.description}
                          thumbnail={course.thumbnail}
                          totalDuration={course.totalDuration}
                          teacherName={course.teacherName}
                          categoryName={course.categoryName}
                          avgRating={Number(course.avgRating ?? 0)}
                          enrollmentCount={Number(course.enrollmentCount ?? 0)}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerGrid>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 flex items-center justify-center gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="rounded-lg border border-border/50 px-4 py-2 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Previous
                      </motion.button>
                      <span className="text-xs text-muted-foreground">
                        Page {page + 1} of {totalPages}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-border/50 px-4 py-2 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                      </motion.button>
                    </motion.div>
                  )}

                  {data.total > PAGE_SIZE && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-3 text-center text-xs text-muted-foreground"
                    >
                      Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, data.total)} of {data.total} courses
                    </motion.p>
                  )}
                </div>
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
          </main>
        </div>
      </AnimatedPage>
      <Footer />
    </div>
  );
}
