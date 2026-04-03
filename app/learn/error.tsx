"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GraduationCap, RefreshCw, ArrowLeft } from "lucide-react";
import { springBounce } from "@/lib/motion";

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
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10"
      >
        <GraduationCap className="h-6 w-6 text-destructive/70" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <h2 className="text-lg font-bold">Lesson unavailable</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t load this lesson. Please try again or go back to your courses.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={springBounce}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </motion.button>
        <Link
          href="/dashboard/student"
          className="flex items-center gap-2 rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/30"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          My courses
        </Link>
      </motion.div>
    </div>
  );
}
