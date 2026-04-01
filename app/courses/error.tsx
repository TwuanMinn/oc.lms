"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Courses error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <span className="text-xl">📚</span>
      </div>
      <h2 className="text-lg font-bold">Couldn&apos;t load courses</h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        We had trouble loading the course catalog. This is usually temporary.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/30"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
