import { SkeletonPage } from "@/components/shared/SkeletonCard";

export default function Loading() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 shrink-0 animate-pulse border-r border-border/40 bg-card lg:block" />
      <div className="flex-1">
        <SkeletonPage />
      </div>
    </div>
  );
}
