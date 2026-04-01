export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 animate-shimmer rounded" />
      <div className="h-4 w-72 animate-shimmer rounded" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <div className="h-4 w-20 animate-shimmer rounded" />
            <div className="mt-3 h-8 w-16 animate-shimmer rounded" />
          </div>
        ))}
      </div>
      <div className="h-64 w-full animate-shimmer rounded-xl" />
    </div>
  );
}
