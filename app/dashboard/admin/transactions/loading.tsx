import { SkeletonTable } from "@/components/shared/SkeletonCard";

export default function TransactionsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[88px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <SkeletonTable />
    </div>
  );
}
