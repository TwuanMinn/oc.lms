import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              L
            </div>
            <span className="text-lg font-semibold tracking-tight">LMS</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/courses"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Courses
            </Link>
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              Now with interactive quizzes
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Learn without{" "}
              <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                limits
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Discover courses from expert instructors. Track your progress,
              take quizzes, earn certificates — all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/courses"
                className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Browse courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-all hover:bg-accent"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="group rounded-xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Structured Learning</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Courses organized into modules and lessons. Progress tracking shows exactly where you are.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Interactive Quizzes</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Test your knowledge with MCQ and multi-select quizzes. Instant feedback and scoring.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <Zap className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">Track Progress</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Mark lessons complete, see your progress ring fill up, and get your learning streak going.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
