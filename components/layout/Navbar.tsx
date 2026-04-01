"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "motion/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as Record<string, unknown> | undefined)?.role as string | undefined;

  const dashboardLink =
    role === "ADMIN"
      ? "/dashboard/admin/analytics"
      : role === "TEACHER"
        ? "/dashboard/teacher/courses"
        : "/dashboard/student";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            L
          </div>
          <span className="text-lg font-semibold tracking-tight">LMS</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/courses"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/courses"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Courses
          </Link>
          <Link
            href="/pricing"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground",
              pathname === "/pricing"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Pricing
          </Link>
          {user && (
            <Link
              href={dashboardLink}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname.startsWith("/dashboard")
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <NotificationBell />
              <button
                onClick={() => signOut()}
                className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
