"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "motion/react";
import { Flame, MessageSquare, ArrowUpRight, Search, Hash, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_THREADS = [
  {
    id: "1",
    title: "How do you handle Z-index in layered React components?",
    author: "Zack99",
    category: "Frontend Docs",
    replies: 42,
    upvotes: 128,
    isHot: true,
    timeAgo: "2h ago",
    tags: ["React", "CSS", "UI/UX"]
  },
  {
    id: "2",
    title: "Drizzle ORM vs Prisma — 2026 definitive benchmarks.",
    author: "DB_Admin_Sarah",
    category: "Backend Scaling",
    replies: 89,
    upvotes: 340,
    isHot: true,
    timeAgo: "4h ago",
    tags: ["Database", "Postgres", "Drizzle"]
  },
  {
    id: "3",
    title: "Review my portfolio? Applying for Junior Roles.",
    author: "AlexDevv",
    category: "Career Lounge",
    replies: 15,
    upvotes: 24,
    isHot: false,
    timeAgo: "12h ago",
    tags: ["Portfolio", "Review"]
  },
  {
    id: "4",
    title: "System Design for a Chat App: WebSockets or Polling?",
    author: "ArchitectX",
    category: "Architecture",
    replies: 56,
    upvotes: 210,
    isHot: true,
    timeAgo: "1d ago",
    tags: ["Systems", "WebSockets"]
  },
  {
    id: "5",
    title: "Figma to Code: Best practices for naming variables.",
    author: "Design2Code",
    category: "Frontend Docs",
    replies: 8,
    upvotes: 12,
    isHot: false,
    timeAgo: "1d ago",
    tags: ["Figma", "CSS"]
  },
  {
    id: "6",
    title: "Next.js App Router performance optimizations you might have missed.",
    author: "NextMaster",
    category: "Frontend Docs",
    replies: 112,
    upvotes: 450,
    isHot: true,
    timeAgo: "2d ago",
    tags: ["NextJS", "Performance"]
  }
];

const CATEGORIES = ["All Topics", "Frontend Docs", "Backend Scaling", "Architecture", "Career Lounge"];

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThreads = MOCK_THREADS.filter(t => {
    const matchesCategory = activeCategory === "All Topics" || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-20 flex flex-col xl:flex-row gap-8 xl:gap-16">
        
        {/* Left Column: Massive Brutalist Hero + Search */}
        <div className="w-full xl:w-1/3 flex flex-col shrink-0 static xl:sticky xl:top-32 xl:h-[calc(100vh-160px)]">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 border-2 border-foreground px-4 py-1.5 w-max text-xs font-black uppercase tracking-[0.2em] text-foreground bg-accent">
              <ShieldCheck className="h-4 w-4" /> Official Hub
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-foreground mix-blend-difference">
              THE<br />HIVE<br />MIND.
            </h1>
            
            <p className="text-muted-foreground font-medium text-lg max-w-sm mt-4 border-l-4 border-primary pl-4">
              Peer-to-peer discussions, code reviews, and architecture debates. Ask anything.
            </p>

            <div className="mt-8 relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground transition-colors group-focus-within:text-primary">
                <Search className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search the hive..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border-2 border-border p-4 pl-12 font-bold uppercase tracking-wider focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Brutalist Categories */}
            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 border-2 text-xs font-bold uppercase tracking-widest transition-all",
                    activeCategory === cat 
                      ? "border-primary bg-primary text-primary-foreground translate-x-1" 
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button className="mt-8 w-full bg-foreground text-background font-black text-xl uppercase tracking-widest py-5 border-2 border-foreground hover:bg-background hover:text-foreground transition-all flex items-center justify-center gap-2 group">
              Start new thread <ArrowUpRight className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Thread Feed (Asymmetric tension) */}
        <div className="w-full xl:w-2/3 flex flex-col gap-0 pb-20">
          <motion.div className="flex flex-col border-2 border-border border-b-0">
            <div className="bg-muted px-6 py-4 flex items-center justify-between border-b-2 border-border font-bold uppercase tracking-widest text-xs text-muted-foreground">
              <span>Feed: {activeCategory}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-foreground"><Flame className="h-4 w-4" /> Hot</div>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> New</div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredThreads.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-12 text-center text-muted-foreground font-bold uppercase tracking-widest border-b-2 border-border"
                >
                  NO THREADS FOUND.
                </motion.div>
              ) : (
                filteredThreads.map((thread, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    key={thread.id}
                    className="group relative flex flex-col sm:flex-row gap-6 p-6 sm:p-8 border-b-2 border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer overflow-hidden"
                  >
                    {/* Interaction column (Upvotes) */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2 shrink-0 sm:w-24">
                      <div className="flex items-center gap-2 font-black text-xl text-foreground">
                        <ArrowUpRight className="h-5 w-5 text-primary" /> {thread.upvotes}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        <MessageSquare className="h-4 w-4" /> {thread.replies}
                      </div>
                      <div className="text-xs font-bold text-muted-foreground sm:mt-auto tracking-widest uppercase">
                        {thread.timeAgo}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col grow justify-between">
                      <div>
                        {thread.isHot && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 tracking-widest mb-2 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5">
                            <Flame className="h-3 w-3" /> Trending
                          </span>
                        )}
                        <h2 className="text-xl sm:text-2xl font-bold leading-tight group-hover:text-primary transition-colors tracking-tight text-foreground pr-8">
                          {thread.title}
                        </h2>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-3 gap-x-4 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-none bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground">
                            {thread.author.substring(0,2).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">{thread.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-bold text-muted-foreground uppercase">{thread.category}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                          {thread.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-border text-muted-foreground group-hover:border-primary/30 transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                      <ChevronRight className="h-8 w-8 text-primary" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
