/* Premium shimmer skeleton components */

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-muted ${className ?? ""}`}>
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <ShimmerBlock className="aspect-video w-full rounded-none" />
      <div className="space-y-3 p-4">
        <ShimmerBlock className="h-3 w-16" />
        <ShimmerBlock className="h-4 w-3/4" />
        <ShimmerBlock className="h-3 w-full" />
        <div className="flex items-center justify-between pt-2">
          <ShimmerBlock className="h-3 w-20" />
          <ShimmerBlock className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <ShimmerBlock className="h-10 w-full rounded-none" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border/50 p-4"
        >
          <ShimmerBlock className="h-8 w-8 rounded-full shrink-0" />
          <ShimmerBlock className="h-4 w-1/4" />
          <ShimmerBlock className="h-4 w-1/3" />
          <ShimmerBlock className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 p-6">
      <ShimmerBlock className="h-8 w-48" />
      <ShimmerBlock className="h-4 w-96" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function SkeletonDashboardHero() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="flex items-center gap-4">
        <ShimmerBlock className="h-14 w-14 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <ShimmerBlock className="h-6 w-60" />
          <ShimmerBlock className="h-4 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <ShimmerBlock className="h-20 rounded-xl" />
        <ShimmerBlock className="h-20 rounded-xl" />
        <ShimmerBlock className="h-20 rounded-xl" />
      </div>
    </div>
  );
}
