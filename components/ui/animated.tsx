"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, type ReactNode } from "react";
import {
  staggerContainer,
  staggerItem,
  staggerItemScale,
  pageTransition,
  staggerContainerSlow,
} from "@/lib/motion";

// ─── Scroll-triggered fade-in ───
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

const directionMap = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });
  const variants = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered grid container ───
interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  slow?: boolean;
}

export function StaggerGrid({ children, className, slow }: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slow ? staggerContainerSlow : staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger item wrapper ───
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  scale?: boolean;
}

export function StaggerItem({ children, className, scale }: StaggerItemProps) {
  return (
    <motion.div
      variants={scale ? staggerItemScale : staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page wrapper for route transitions ───
interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatePresence wrapper (re-export convenience) ───
export { AnimatePresence };

// ─── Animated text with character stagger ───
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.04, delayChildren: delay },
        },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 200, damping: 20 },
            },
          }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ─── Animated counter ───
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ value, suffix = "", className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      className={className}
    >
      {isInView ? `${value.toLocaleString("en-US")}${suffix}` : "0"}
    </motion.span>
  );
}

// ─── Animated word switcher ───
interface AnimatedWordSwitcherProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function AnimatedWordSwitcher({ words, className, interval = 3000 }: AnimatedWordSwitcherProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className="inline-grid relative">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={className}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Infinite Marquee ───
interface InfiniteMarqueeProps {
  children: ReactNode;
  speed?: number; // seconds to complete one loop
  className?: string;
}

export function InfiniteMarquee({ children, speed = 30, className }: InfiniteMarqueeProps) {
  return (
    <div className={`overflow-hidden flex w-full relative group ${className || ""}`}>
      {/* Gradients for fading edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      
      <style suppressHydrationWarning>{`
        @keyframes scroll-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .scrolling-track {
          animation: scroll-marquee ${speed}s linear infinite;
        }
        .group:hover .scrolling-track {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="flex w-max scrolling-track">
        <div className="flex shrink-0 items-stretch">{children}</div>
        <div className="flex shrink-0 items-stretch">{children}</div>
      </div>
    </div>
  );
}

// ─── Animated Shimmer Button Wrapper ───
interface AnimatedShimmerButtonProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedShimmerButton({ children, className }: AnimatedShimmerButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative overflow-hidden inline-flex ${className || ""}`}
    >
      <motion.div
        animate={{
          x: ["-200%", "300%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
          repeatDelay: 1.5,
        }}
        className="pointer-events-none absolute inset-0 z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/20"
      />
      <div className="relative z-0 flex w-full h-full items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
