"use client";

import { type LucideIcon, Inbox } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-background to-muted/20 py-24 px-6 text-center shadow-sm"
    >
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

      <motion.div
        initial={{ scale: 0, rotate: -15, filter: "blur(10px)" }}
        animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
        className="relative mb-6 flex h-24 w-24 items-center justify-center"
      >
        <div className="absolute inset-0 rounded-3xl bg-primary/10 rotate-6 scale-105 transition-transform duration-500 hover:rotate-12" />
        <div className="absolute inset-0 rounded-3xl bg-primary/5 -rotate-6 scale-105 backdrop-blur-sm" />
        <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-card border border-border/50 shadow-sm transition-transform duration-500 hover:scale-105">
          <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>
        
        {/* Floating particles */}
        <motion.div 
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary/30"
        />
        <motion.div 
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1 -left-2 h-3 w-3 rounded-full bg-rose-500/20"
        />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold tracking-tight text-foreground"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 max-w-[280px] sm:max-w-sm text-sm text-muted-foreground leading-relaxed"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 25 }}
          className="mt-8"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
