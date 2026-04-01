"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Zap, Users, Award, TrendingUp } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
  AnimatedText,
  AnimatedCounter,
} from "@/components/ui/animated";
import {
  fadeInUp,
  staggerContainer,
  springBounce,
  hoverGlow,
} from "@/lib/motion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    description:
      "Courses organized into modules and lessons. Progress tracking shows exactly where you are.",
  },
  {
    icon: GraduationCap,
    title: "Interactive Quizzes",
    description:
      "Test your knowledge with MCQ and multi-select quizzes. Instant feedback and scoring.",
  },
  {
    icon: Zap,
    title: "Track Progress",
    description:
      "Mark lessons complete, see your progress ring fill up, and get your learning streak going.",
  },
];

const stats = [
  { value: 10000, suffix: "+", label: "Students learning", icon: Users },
  { value: 500, suffix: "+", label: "Expert courses", icon: BookOpen },
  { value: 98, suffix: "%", label: "Completion rate", icon: TrendingUp },
  { value: 50, suffix: "+", label: "Certificates issued", icon: Award },
];

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <div className="relative min-h-screen">
      {/* Background ambient glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-20 right-1/4 h-[300px] w-[500px] rounded-full bg-rose-500/3 blur-3xl"
        />
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.1 }}
              transition={springBounce}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold"
            >
              L
            </motion.div>
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
              href="/pricing"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <motion.span
                animate={{ rotate: [0, 14, -14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <Zap className="h-3.5 w-3.5" />
              </motion.span>
              Now with interactive quizzes
            </motion.div>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <AnimatedText text="Learn without" delay={0.2} />{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
                className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent"
              >
                limits
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Discover courses from expert instructors. Track your progress,
              take quizzes, earn certificates — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/courses"
                  className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  Browse courses
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/register"
                  className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-all hover:bg-accent hover:border-primary/30"
                >
                  Create account
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-border/40 bg-card/30">
          <div
            ref={statsRef}
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
          >
            <motion.div
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <stat.icon className="mx-auto h-6 w-6 text-primary/60" />
                  <div className="mt-3 text-3xl font-bold tracking-tight">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/40 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <ScrollReveal>
              <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
                Everything you need to learn
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
                A modern platform designed for focused, effective learning.
              </p>
            </ScrollReveal>

            <StaggerGrid className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <StaggerItem key={feature.title} scale>
                  <motion.div
                    whileHover={{
                      y: -4,
                      borderColor: "rgba(225, 29, 72, 0.3)",
                      boxShadow: "0 8px 30px rgba(225, 29, 72, 0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="cursor-pointer rounded-xl border border-border/50 p-6 transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: -8, scale: 1.1 }}
                      transition={springBounce}
                    >
                      <feature.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>

        {/* CTA */}
        <ScrollReveal>
          <section className="border-t border-border/40">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
              <motion.div
                whileHover={{
                  boxShadow: "0 0 40px rgba(225, 29, 72, 0.1)",
                }}
                className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-rose-500/5 px-8 py-16 text-center"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,29,72,0.06)_0%,_transparent_70%)]" />
                <div className="relative">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Start your learning journey
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    Join thousands of learners. Access expert-led courses, track
                    your progress, and earn certificates.
                  </p>
                  <motion.div
                    className="mt-8 inline-block"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                    >
                      Get started for free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-border/40"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                  L
                </div>
                <span className="font-semibold">LMS</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                A modern platform for focused, effective learning.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform
              </h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Courses</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</Link></li>
                <li><Link href="/register" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Get started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Support
              </h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Help center</Link></li>
                <li><Link href="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Legal
              </h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy</Link></li>
                <li><Link href="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-border/40 pt-6">
            <p className="text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
