"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home, BookOpen, GraduationCap } from "lucide-react";

const FLOATING_SHAPES = [
  { size: 60, x: "15%", y: "20%", delay: 0, duration: 6, color: "bg-primary/10" },
  { size: 40, x: "80%", y: "15%", delay: 1, duration: 7, color: "bg-rose-500/10" },
  { size: 50, x: "70%", y: "75%", delay: 2, duration: 5, color: "bg-amber-500/10" },
  { size: 30, x: "20%", y: "80%", delay: 0.5, duration: 8, color: "bg-emerald-500/10" },
  { size: 35, x: "50%", y: "10%", delay: 1.5, duration: 6, color: "bg-sky-500/10" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/20" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Floating decorative shapes */}
      {FLOATING_SHAPES.map((shape, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute rounded-xl ${shape.color}`}
          style={{ width: shape.size, height: shape.size, left: shape.x, top: shape.y }}
        />
      ))}

      {/* Giant 404 background text */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] font-black leading-none text-primary/3 select-none pointer-events-none"
      >
        404
      </motion.span>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative text-center"
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className="mx-auto mb-8"
        >
          <div className="relative inline-flex">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 shadow-xl shadow-primary/5"
            >
              <GraduationCap className="h-12 w-12 text-primary" strokeWidth={1.5} />
            </motion.div>

            {/* Floating question mark */}
            <motion.div
              animate={{ y: [-2, -8, -2], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold shadow-lg"
            >
              ?
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold tracking-tight text-foreground"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground"
        >
          Oops! This page seems to have wandered off campus.
          Let&apos;s get you back to learning.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/courses"
              className="flex items-center gap-2.5 rounded-xl border border-border px-8 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:border-border/80"
            >
              <BookOpen className="h-4 w-4" />
              Browse courses
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 flex items-center gap-2 text-xs text-muted-foreground/60"
      >
        <GraduationCap className="h-3.5 w-3.5" />
        <span>Green Academy</span>
      </motion.div>
    </div>
  );
}
