import Link from "next/link";
import { motion } from "motion/react";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Background ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative">
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[180px] font-bold leading-none text-primary/5 select-none">
          404
        </span>
        <div className="relative pt-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Search className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
            <Link
              href="/courses"
              className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold transition-all hover:bg-accent"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
