export default function RegisterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mx-auto flex items-center justify-center gap-2">
          <div className="h-8 w-8 animate-shimmer rounded-md" />
          <div className="h-5 w-12 animate-shimmer rounded" />
        </div>
        <div className="mt-8 rounded-xl border border-border/50 bg-card p-6">
          <div className="mx-auto h-6 w-40 animate-shimmer rounded" />
          <div className="mx-auto mt-2 h-4 w-56 animate-shimmer rounded" />
          <div className="mt-6 space-y-4">
            <div>
              <div className="h-4 w-16 animate-shimmer rounded" />
              <div className="mt-1.5 h-10 w-full animate-shimmer rounded-lg" />
            </div>
            <div>
              <div className="h-4 w-12 animate-shimmer rounded" />
              <div className="mt-1.5 h-10 w-full animate-shimmer rounded-lg" />
            </div>
            <div>
              <div className="h-4 w-16 animate-shimmer rounded" />
              <div className="mt-1.5 h-10 w-full animate-shimmer rounded-lg" />
            </div>
            <div className="h-10 w-full animate-shimmer rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
