import { Navbar } from "@/components/layout/Navbar";
import { SkeletonCard } from "@/components/shared/SkeletonCard";

export default function CoursesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex max-w-[1400px] flex-1 gap-6 px-4 py-8 sm:px-6">
        {/* Sidebar skeleton (desktop only) */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
              <div className="h-4 w-16 animate-shimmer rounded" />
              <div className="h-3 w-32 animate-shimmer rounded" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-shimmer rounded-lg" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
              <div className="h-4 w-20 animate-shimmer rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 w-full animate-shimmer rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="min-w-0 flex-1">
          <div className="mb-8">
            <div className="h-9 w-48 animate-shimmer rounded" />
            <div className="mt-2 h-4 w-64 animate-shimmer rounded" />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="h-10 w-64 animate-shimmer rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-20 animate-shimmer rounded-md" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
