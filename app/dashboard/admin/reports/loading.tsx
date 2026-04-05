export default function ReportsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      <div className="h-[340px] animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[300px] animate-pulse rounded-xl bg-muted" />
        <div className="h-[300px] animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
