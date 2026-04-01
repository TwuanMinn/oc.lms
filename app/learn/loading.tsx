export default function LearnLoading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden w-72 shrink-0 border-r border-border/50 bg-card p-4 lg:block">
        <div className="h-6 w-32 animate-shimmer rounded" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-full animate-shimmer rounded" />
              <div className="space-y-1 pl-4">
                <div className="h-4 w-3/4 animate-shimmer rounded" />
                <div className="h-4 w-2/3 animate-shimmer rounded" />
                <div className="h-4 w-4/5 animate-shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="aspect-video w-full animate-shimmer rounded-xl" />
          <div className="mt-6 flex items-center justify-between">
            <div className="h-7 w-64 animate-shimmer rounded" />
            <div className="flex gap-2">
              <div className="h-9 w-9 animate-shimmer rounded-lg" />
              <div className="h-9 w-28 animate-shimmer rounded-lg" />
            </div>
          </div>
          <div className="mt-4 h-4 w-full animate-shimmer rounded" />
          <div className="mt-2 h-4 w-3/4 animate-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
