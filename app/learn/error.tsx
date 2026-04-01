"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LearnError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Learn error:", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <span className="text-xl">🎓</span>
      </div>
      <h2 className="text-lg font-bold">Lesson unavailable</h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        We couldn&apos;t load this lesson. Please try again or go back to your
        courses.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
        <Link
          href="/dashboard/student"
          className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/30"
        >
          My courses
        </Link>
      </div>
    </div>
  );
}
