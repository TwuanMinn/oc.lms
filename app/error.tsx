"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { springBounce } from "@/lib/motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      {/* Background ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/5 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10"
      >
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or contact support if the
          problem persists.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground/50">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={springBounce}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </motion.button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-semibold transition-all hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
      </motion.div>
    </div>
  );
}
