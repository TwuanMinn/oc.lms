export default function PricingLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-64 animate-shimmer rounded-lg" />
          <div className="mx-auto mt-4 h-5 w-96 animate-shimmer rounded-lg" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-shimmer rounded-lg" />
                <div className="space-y-2">
                  <div className="h-5 w-24 animate-shimmer rounded" />
                  <div className="h-3 w-32 animate-shimmer rounded" />
                </div>
              </div>
              <div className="mt-6 h-10 w-28 animate-shimmer rounded" />
              <div className="mt-6 space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-full animate-shimmer rounded" />
                ))}
              </div>
              <div className="mt-6 h-10 w-full animate-shimmer rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
