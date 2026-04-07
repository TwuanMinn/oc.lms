"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, Zap, Users, Award, TrendingUp, Star, Quote, PlayCircle, Clock, CheckCircle2, Check, Sparkles, Target, Trophy, Flame, Linkedin, MessageCircle, ChevronDown, Shield, Cloud, Layers, Smartphone, BrainCircuit } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
  AnimatedText,
  AnimatedCounter,
  AnimatedWordSwitcher,
  InfiniteMarquee,
  AnimatedShimmerButton,
} from "@/components/ui/animated";
import {
  fadeInUp,
  staggerContainer,
} from "@/lib/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/hooks/useAuth";



const stats = [
  { value: 10000, suffix: "+", label: "Students learning", icon: Users },
  { value: 500, suffix: "+", label: "Expert courses", icon: BookOpen },
  { value: 98, suffix: "%", label: "Completion rate", icon: TrendingUp },
  { value: 50, suffix: "+", label: "Certificates issued", icon: Award },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    avatar: "/images/avatar-sarah.png",
    quote: "This platform transformed how I learn. The structured modules and quizzes kept me engaged and accountable.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Data Analyst",
    avatar: "/images/avatar-marcus.png",
    quote: "I earned my certificates in half the time compared to other platforms. The progress tracking is addictive!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    avatar: "/images/avatar-emily.png",
    quote: "Clean interface, great content, and the learning streaks keep me coming back every day. Highly recommend.",
    rating: 5,
  },
];

const trendingCourses = [
  {
    title: "Full-Stack Next.js Mastery",
    category: "Development",
    rating: 4.9,
    students: "12.4k",
    modules: 14,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    title: "Advanced UI/UX Animation",
    category: "Design",
    rating: 5.0,
    students: "8.2k",
    modules: 10,
    gradient: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-500",
  },
  {
    title: "Database Architect Pro",
    category: "Backend",
    rating: 4.8,
    students: "6.1k",
    modules: 18,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  }
];

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const { isAuthenticated, dashboardPath, isLoading } = useAuth();
  const [demoQuizState, setDemoQuizState] = useState<"idle" | "correct" | "wrong">("idle");

  const { scrollY } = useScroll();

  const heroBgY = useTransform(scrollY, [0, 800], [0, 250]);
  
  // Cinematic background color journey
  const glowColor1 = useTransform(scrollY, [0, 1500, 3000], ["rgba(225,29,72,0.05)", "rgba(124,58,237,0.08)", "rgba(16,185,129,0.05)"]);
  const glowColor2 = useTransform(scrollY, [0, 1500, 3000], ["rgba(225,29,72,0.03)", "rgba(79,70,229,0.08)", "rgba(14,165,233,0.05)"]);

  return (
    <div className="relative min-h-screen">
      {/* Background ambient glow journey */}
      <motion.div style={{ y: heroBgY }} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ backgroundColor: glowColor1 }}
          className="absolute -top-40 left-1/2 h-[800px] w-[1000px] -translate-x-1/2 rounded-full blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ backgroundColor: glowColor2 }}
          className="absolute top-1/4 right-0 h-[600px] w-[800px] rounded-full blur-[120px]"
        />
      </motion.div>

      {/* Navbar (shared component) */}
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-primary shadow-sm"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                New Semester 2024
              </motion.div>

              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <AnimatedText text="Learn without" delay={0.2} />{" "}
                <AnimatedWordSwitcher
                  words={["limits", "boundaries", "friction", "compromise"]}
                  className="bg-linear-to-r from-primary to-rose-400 bg-clip-text text-transparent"
                />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              >
                Discover courses from expert instructors. Track your progress,
                take quizzes, earn certificates — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-10 flex items-center gap-4"
              >
                <AnimatedShimmerButton className="rounded-lg shadow-lg shadow-primary/20 bg-primary">
                  <Link
                    href={isAuthenticated ? dashboardPath : "/register"}
                    className="group flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary-foreground transition-all"
                  >
                    {isLoading ? "Loading..." : isAuthenticated ? "Go to Dashboard" : "Get started for free"}
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                </AnimatedShimmerButton>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/courses"
                    className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-all hover:bg-accent hover:border-primary/30"
                  >
                    Browse courses
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.4 }}
              className="relative hidden justify-end lg:flex"
            >
              <div className="relative w-full max-w-lg aspect-square bg-linear-to-br from-card to-background rounded-[2.5rem] shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden border border-border/50">
                <Image
                  src="/images/hero-illustration.png"
                  alt="Online learning platform"
                  fill
                  className="object-cover rounded-3xl grayscale-15 hover:grayscale-0 transition-all duration-700 p-2"
                  priority
                />
                
                {/* Floating Glass Card UI 1 */}
                <div className="absolute top-12 right-0 backdrop-blur-xl bg-background/80 p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex shrink-0 items-center justify-center text-emerald-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Success Rate</p>
                    <p className="text-lg font-extrabold text-foreground tracking-tight">94% Mastery</p>
                  </div>
                </div>

                {/* Floating Glass Card UI 2 */}
                <div className="absolute bottom-12 left-0 backdrop-blur-xl bg-background/80 p-4 rounded-2xl shadow-xl border border-border/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </div>
                    <span className="text-xs font-bold text-foreground">Live Class: Advanced UX</span>
                  </div>
                  <div className="h-2 w-48 bg-secondary rounded-full overflow-hidden mt-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "66%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-primary rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Proof Trust Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 pt-10 border-t border-border/40"
          >
            <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
              Trusted by instructors & teams at
            </p>
            <div className="overflow-hidden flex w-full relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10" />
              <div className="flex shrink-0 animate-[scroll-marquee_20s_linear_infinite] gap-16 pr-16 items-center">
                {["Acme Corp", "Globex", "Initech", "Soylent", "Umbrella", "Stark Ind."].map((company, i) => (
                  <div key={i} className="text-2xl font-black tracking-tighter text-muted-foreground/30 hover:text-muted-foreground transition-colors duration-300">
                    {company}
                  </div>
                ))}
                {["Acme Corp", "Globex", "Initech", "Soylent", "Umbrella", "Stark Ind."].map((company, i) => (
                  <div key={i + "clone"} className="text-2xl font-black tracking-tighter text-muted-foreground/30 hover:text-muted-foreground transition-colors duration-300">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="relative border-y border-border/40 bg-card/10 py-20 overflow-hidden">
          {/* Decorative ambient light */}
          <div className="absolute left-1/2 top-0 -z-10 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-primary/40 to-transparent shadow-[0_0_20px_rgba(225,29,72,0.6)]" />
          
          <div
            ref={statsRef}
            className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10"
          >
            <motion.div
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="group relative flex flex-col items-center justify-center rounded-3xl border border-border/30 bg-background/50 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(225,29,72,0.06)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-3 text-sm sm:text-base font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="relative py-24 sm:py-32">
          {/* Ambient bg */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.06),transparent_50%)]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
                  Why Choose Us
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  Everything you need to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">
                    learn faster
                  </span>
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  A modern platform designed with focused, effective learning paths to accelerate your career growth and mastery.
                </p>
              </div>
            </ScrollReveal>
            <StaggerGrid className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1: Structured Learning */}
              <StaggerItem scale>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/30 bg-card p-6 sm:p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight">Structured Learning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Courses organized into modules and lessons. Progress tracking shows exactly where you are.</p>
                </div>
              </StaggerItem>

              {/* Feature 2: Micro-Demo Quiz */}
              <StaggerItem scale>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border-transparent bg-primary/5 p-6 sm:p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-primary">Try a Micro-Quiz</h3>
                  <p className="text-sm text-primary/70 leading-relaxed mb-6">What does &quot;DOM&quot; stand for in web development?</p>
                  <div className="flex flex-col gap-2 mt-auto">
                    <button 
                      onClick={() => setDemoQuizState("wrong")}
                      className={`text-left px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${demoQuizState === "wrong" ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-900" : "bg-background border-border/50 hover:border-primary/30"}`}
                    >
                      A. Data Object Matrix
                    </button>
                    <button 
                      onClick={async (e) => {
                        setDemoQuizState("correct");
                        const rect = e.currentTarget.getBoundingClientRect();
                        const { default: confetti } = await import("canvas-confetti");
                        confetti({ 
                          particleCount: 100, spread: 70, 
                          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
                          colors: ['#e11d48', '#4f46e5', '#10b981']
                        });
                        setTimeout(() => setDemoQuizState("idle"), 3000);
                      }}
                      className={`text-left px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${demoQuizState === "correct" ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900" : "bg-background border-border/50 hover:border-primary/30"}`}
                    >
                       {demoQuizState === "correct" ? <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> B. Document Object Model</span> : "B. Document Object Model"}
                    </button>
                  </div>
                </div>
              </StaggerItem>

              {/* Feature 3: Track Progress */}
              <StaggerItem scale>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/30 bg-card p-6 sm:p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight">Track Progress</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Mark lessons complete, see your progress ring fill up, and get your learning streak going.</p>
                </div>
              </StaggerItem>
            </StaggerGrid>

            {/* Industry Experts Sub-section */}
            <div className="mt-32">
              <ScrollReveal>
                <div className="mb-10 text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Learn from industry experts</h3>
                  <p className="mt-2 text-muted-foreground text-lg">Our instructors are leads and managers at top tech companies.</p>
                </div>
              </ScrollReveal>

              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { initials: "AR", name: "Alex Rivera", role: "Ex-Google Engineer", roleColor: "text-emerald-600 dark:text-emerald-400", courses: 12, rating: 5.0, gradient: "from-indigo-500 to-rose-500" },
                  { initials: "JL", name: "Jordan Lee", role: "Sr. UX Lead @ Stripe", roleColor: "text-emerald-600 dark:text-emerald-400", courses: 8, rating: 4.9, gradient: "from-purple-500 to-pink-500" },
                  { initials: "SC", name: "Sarah Chen", role: "Data Scientist @ Meta", roleColor: "text-emerald-600 dark:text-emerald-400", courses: 15, rating: 4.9, gradient: "from-blue-500 to-indigo-500" },
                  { initials: "MV", name: "Michael Vance", role: "Cloud Architect", roleColor: "text-emerald-600 dark:text-emerald-400", courses: 9, rating: 4.8, gradient: "from-violet-500 to-fuchsia-500" },
                ].map((inst, i) => (
                  <StaggerItem key={i} scale>
                    <div className="group flex h-full flex-col items-center overflow-hidden rounded-3xl border border-border/30 bg-card p-6 sm:p-8 transition-all hover:shadow-lg hover:-translate-y-1">
                      {/* Avatar */}
                      <div className={`w-20 h-20 rounded-full mb-5 bg-linear-to-br ${inst.gradient} flex items-center justify-center text-white text-2xl font-bold tracking-wide shadow-sm transition-transform group-hover:scale-105`}>
                        {inst.initials}
                      </div>
                      
                      {/* Info */}
                      <h4 className="text-lg font-bold tracking-tight mb-1">{inst.name}</h4>
                      <p className={`text-xs font-semibold ${inst.roleColor} mb-6`}>{inst.role}</p>
                      
                      {/* Footer Stats */}
                      <div className="w-full flex items-center justify-between text-muted-foreground text-xs font-medium mt-auto pt-4 border-t border-border/40">
                        <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {inst.courses}</span>
                        <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {inst.rating}</span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </div>
        </section>

        {/* Trending Courses Spotlight */}
        <section className="relative py-20 bg-card/30 border-y border-border/40 overflow-hidden">
           {/* Ambient subtle glow */}
           <div className="absolute right-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
           
           <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Trending Courses</h2>
                  <p className="mt-2 text-muted-foreground">Jumpstart your skills with our most popular picks.</p>
                </div>
                <Link href="/courses" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group">
                  View all courses <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {trendingCourses.map((course) => (
                <StaggerItem key={course.title} scale>
                  <TiltCard rotationIntensity={10} className="h-full">
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/60 shadow-sm backdrop-blur-md transition-all hover:border-primary/30 cursor-pointer">
                      {/* Fake Course Thumbnail Gradient */}
                      <div className={`h-40 w-full bg-linear-to-br ${course.gradient} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/5" />
                        <PlayCircle className={`h-12 w-12 opacity-50 ${course.iconColor} group-hover:scale-110 group-hover:opacity-80 transition-all duration-300`} />
                      </div>
                      
                      <div className="p-6 flex flex-col grow">
                        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <span>{course.category}</span>
                          <span className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-4 group-hover:text-primary transition-colors">{course.title}</h3>
                        
                        <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground border-t border-border/40 pt-4">
                          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.students}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.modules} modules</span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerGrid>
           </div>
        </section>


        {/* Testimonials */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
                Loved by learners
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
                Hear from students who transformed their careers.
              </p>
            </ScrollReveal>

            <div className="mt-16 w-full max-w-[100vw] overflow-hidden -mx-4 sm:-mx-6 px-4 sm:px-6 hide-scrollbar">
              <InfiniteMarquee speed={40} className="gap-6 pb-4">
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={`${t.name}-${idx}`}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 30px rgba(225, 29, 72, 0.06)",
                      borderColor: "rgba(225, 29, 72, 0.25)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-[480px] shrink-0 rounded-3xl border border-border/50 bg-card p-8 shadow-sm mr-8 flex flex-col justify-between"
                  >
                    <div>
                      <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/5" />
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="mt-6 text-lg sm:text-xl font-medium leading-relaxed text-foreground/90">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-4 border-t border-border/40 pt-6 relative z-10">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover shadow-sm bg-accent/50"
                      />
                      <div>
                        <p className="text-lg font-bold">{t.name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </InfiniteMarquee>
            </div>
          </div>
        </section>

        {/* Journey to Mastery Pathway */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Dual ambient glows */}
          <div className="absolute left-1/4 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[150px]" />
          <div className="absolute right-1/4 bottom-0 -z-10 h-[400px] w-[500px] rounded-full bg-rose-500/5 blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal className="text-center mb-20">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
                <Sparkles className="h-4 w-4 mr-2" /> Learning Paths
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                Your path to{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-rose-400">mastery</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                A structured curriculum designed to take you from fundamentals to production-ready skills.
              </p>
            </ScrollReveal>

            {/* Timeline */}
            <div className="relative max-w-5xl mx-auto pb-12">
              {/* Vertical connecting line */}
              <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
                <div className="absolute inset-0 rounded-full bg-linear-to-b from-primary/40 via-rose-400/30 to-emerald-500/20" />
                <motion.div 
                  initial={{ height: 0 }} 
                  whileInView={{ height: "100%" }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-full rounded-full bg-linear-to-b from-primary via-rose-400 to-emerald-500 origin-top"
                >
                  {/* Destination Stop Circle (travels with line) */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center">
                    {/* Radar Pulse Rings */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-emerald-500"
                      animate={{ scale: [1, 3], opacity: [0.4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-emerald-500"
                      animate={{ scale: [1, 3], opacity: [0.4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 }}
                    />
                    {/* Core Circle */}
                    <div className="relative z-10 w-16 h-16 rounded-full border-8 border-background bg-emerald-500 flex items-center justify-center ring-4 ring-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                      <div className="w-5 h-5 rounded-full bg-background/90" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {[
                { 
                  title: "Foundations", 
                  desc: "Master HTML, CSS, JavaScript, and Git. Build real projects with guided, hands-on exercises from day one.", 
                  icon: BookOpen, 
                  level: "Beginner",
                  modules: 8, hours: 24, progress: 100,
                  iconBg: "bg-blue-500/10", iconRing: "ring-blue-500/30", iconColor: "text-blue-500",
                  gradient: "from-blue-500/10 to-cyan-500/5",
                  progressColor: "from-blue-500 to-cyan-500"
                },
                { 
                  title: "Advanced Systems", 
                  desc: "Dive deep into React, Next.js, databases, and API design. Learn architecture patterns from top engineering teams.", 
                  icon: Zap, 
                  level: "Intermediate",
                  modules: 12, hours: 40, progress: 66,
                  iconBg: "bg-primary/10", iconRing: "ring-primary/30", iconColor: "text-primary",
                  gradient: "from-primary/10 to-rose-500/5",
                  progressColor: "from-primary to-rose-500"
                },
                { 
                  title: "Production Deploy", 
                  desc: "Ship real applications with CI/CD, monitoring, security, and scaling. Graduate with a portfolio of deployed projects.", 
                  icon: Target, 
                  level: "Advanced",
                  modules: 10, hours: 32, progress: 20,
                  iconBg: "bg-emerald-500/10", iconRing: "ring-emerald-500/30", iconColor: "text-emerald-500",
                  gradient: "from-emerald-500/10 to-teal-500/5",
                  progressColor: "from-emerald-500 to-teal-500"
                },
                { 
                  title: "Testing & QA", 
                  desc: "Write bulletproof unit, integration, and E2E tests. Master TDD workflows, mocking strategies, and CI test pipelines.", 
                  icon: Shield, 
                  level: "Intermediate",
                  modules: 8, hours: 28, progress: 45,
                  iconBg: "bg-amber-500/10", iconRing: "ring-amber-500/30", iconColor: "text-amber-500",
                  gradient: "from-amber-500/10 to-yellow-500/5",
                  progressColor: "from-amber-500 to-yellow-500"
                },
                { 
                  title: "Cloud & DevOps", 
                  desc: "Deploy to AWS, GCP, and Vercel. Automate with Docker, GitHub Actions, and infrastructure-as-code patterns.", 
                  icon: Cloud, 
                  level: "Advanced",
                  modules: 9, hours: 36, progress: 10,
                  iconBg: "bg-sky-500/10", iconRing: "ring-sky-500/30", iconColor: "text-sky-500",
                  gradient: "from-sky-500/10 to-blue-500/5",
                  progressColor: "from-sky-500 to-blue-500"
                },
                { 
                  title: "System Design", 
                  desc: "Design scalable distributed systems. Master load balancing, caching, message queues, and microservice architecture.", 
                  icon: Layers, 
                  level: "Expert",
                  modules: 6, hours: 20, progress: 85,
                  iconBg: "bg-rose-500/10", iconRing: "ring-rose-500/30", iconColor: "text-rose-500",
                  gradient: "from-rose-500/10 to-pink-500/5",
                  progressColor: "from-rose-500 to-pink-500"
                },
                { 
                  title: "Mobile Development", 
                  desc: "Build cross-platform mobile apps with React Native. Handle navigation, native APIs, animations, and app store deployment.", 
                  icon: Smartphone, 
                  level: "Intermediate",
                  modules: 11, hours: 34, progress: 33,
                  iconBg: "bg-violet-500/10", iconRing: "ring-violet-500/30", iconColor: "text-violet-500",
                  gradient: "from-violet-500/10 to-purple-500/5",
                  progressColor: "from-violet-500 to-purple-500"
                },
                { 
                  title: "AI & Machine Learning", 
                  desc: "Integrate AI APIs, build intelligent features, and understand ML fundamentals. From prompt engineering to model fine-tuning.", 
                  icon: BrainCircuit, 
                  level: "Expert",
                  modules: 7, hours: 26, progress: 63,
                  iconBg: "bg-teal-500/10", iconRing: "ring-teal-500/30", iconColor: "text-teal-500",
                  gradient: "from-teal-500/10 to-cyan-500/5",
                  progressColor: "from-teal-500 to-cyan-500"
                },
              ].map((step, idx) => (
                <div key={idx} className={`relative flex items-start gap-6 md:gap-40 mb-20 last:mb-0 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    {/* Icon node on the timeline — pops in then floats */}
                    <div className="absolute left-12 md:left-1/2 -translate-x-1/2 z-20">
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ type: "spring", stiffness: 260, damping: 15, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.15, rotate: -6 }}
                        className={`w-24 h-24 rounded-3xl ${step.iconBg} ${step.iconColor} ring-4 ${step.iconRing} ring-offset-2 ring-offset-background flex items-center justify-center shadow-lg backdrop-blur-sm`}
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                        >
                          <step.icon className="h-10 w-10" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Spacer for mobile (accounts for icon) */}
                    <div className="w-28 shrink-0 md:hidden" />

                    {/* Empty side (desktop only) */}
                    <div className="hidden md:block md:w-1/2" />

                    {/* Card — slides in from the side */}
                    <motion.div 
                      initial={{ opacity: 0, x: idx % 2 === 0 ? 60 : -60, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ type: "spring", stiffness: 100, damping: 18, delay: idx * 0.08 + 0.15 }}
                      whileHover={{ y: -6, boxShadow: "0 25px 50px -15px rgba(225,29,72,0.12)" }}
                      className="grow md:w-1/2 group"
                    >
                      <div className={`relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl`}>
                        {/* Top gradient accent */}
                        <div className={`h-1.5 w-full bg-linear-to-r ${step.gradient}`} />
                        
                        {/* Hover glow overlay */}
                        <div className="absolute -inset-px bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl" />
                        
                        <div className="relative p-7">
                          {/* Header row */}
                          <div className="flex items-center justify-between mb-4">
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 + 0.3 }}
                              className={`text-xs font-bold uppercase tracking-widest ${step.iconColor} ${step.iconBg} px-3 py-1 rounded-full`}
                            >
                              {step.level}
                            </motion.span>
                            <span className="text-xs font-medium text-muted-foreground">{step.modules} modules · {step.hours}h</span>
                          </div>

                          {/* Title & description */}
                          <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{step.desc}</p>
                          
                          {/* Animated progress bar */}
                          <div>
                            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1.5">
                              <span>Curriculum progress</span>
                              <motion.span 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 + idx * 0.2 }}
                                className="text-foreground font-bold"
                              >
                                {step.progress}%
                              </motion.span>
                            </div>
                            <div className="h-2 w-full bg-secondary/80 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${step.progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.4, delay: 0.5 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className={`h-full rounded-full bg-linear-to-r ${step.progressColor}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof of Skill Bento Grid */}
        <section className="relative py-24 border-y border-border/40 bg-card/10 overflow-hidden">
          <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[150px]" />
          <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <ScrollReveal className="mb-16">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
                <Trophy className="h-4 w-4 mr-2" /> Credentials
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-center">
                Prove your{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-orange-500">expertise</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-center text-lg">Build a verified portfolio of achievements as you learn and grow.</p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
               {/* Main Certificate Card */}
               <TiltCard rotationIntensity={12} className="md:col-span-2 h-full">
                 <div className="rounded-3xl border border-border/50 bg-card p-10 shadow-lg relative overflow-hidden h-full flex flex-col group transition-all duration-300 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.1)]">
                    {/* Background decoration */}
                    <div className="absolute -right-16 -top-16 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700">
                      <Award className="w-80 h-80" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-80 h-40 bg-linear-to-tl from-primary/5 to-transparent rounded-tl-full" />
                    
                    <div className="relative z-10 flex items-start justify-between mb-8">
                       <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-200 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                          <Trophy className="text-amber-900 w-8 h-8" />
                       </div>
                       <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                         <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Blockchain Verified</span>
                       </div>
                    </div>
                    
                    <div className="relative z-10 grow flex flex-col justify-end">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Industry Certificates</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">Earn verifiable, shareable certificates upon completing each learning path. Recognized by hiring managers and integrated with LinkedIn profiles.</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground"><Award className="h-4 w-4 text-amber-500" /> 2,400+ issued</span>
                        <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4 text-primary" /> 94% employer approval</span>
                      </div>
                    </div>
                 </div>
               </TiltCard>

               {/* Side cards stack */}
               <div className="grid gap-6">
                 <TiltCard rotationIntensity={10} className="h-full">
                   <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm group hover:border-orange-500/30 hover:shadow-[0_12px_24px_-8px_rgba(249,115,22,0.1)] transition-all h-full relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 opacity-[0.04]"><Flame className="w-40 h-40" /></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-400/20 to-red-500/20 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-orange-500 group-hover:animate-pulse" />
                          </div>
                          <div className="text-right ml-auto">
                            <p className="text-2xl font-black text-foreground">12</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Day Streak</p>
                          </div>
                        </div>
                        <h4 className="font-bold text-lg mb-1">Learning Streaks</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">Build consistent habits with daily streak tracking. Unlock badges at 7, 30, and 100-day milestones.</p>
                      </div>
                   </div>
                 </TiltCard>
                 <TiltCard rotationIntensity={10} className="h-full">
                   <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm group hover:border-[#0077b5]/30 hover:shadow-[0_12px_24px_-8px_rgba(0,119,181,0.1)] transition-all h-full relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 opacity-[0.04]"><Linkedin className="w-40 h-40" /></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 flex items-center justify-center">
                            <Linkedin className="w-6 h-6 text-[#0077b5]" />
                          </div>
                        </div>
                        <h4 className="font-bold text-lg mb-1">1-Click Share</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">Instantly share certificates to LinkedIn, Twitter/X, or generate a unique public portfolio link.</p>
                      </div>
                   </div>
                 </TiltCard>
               </div>
            </div>
          </div>
        </section>

        {/* The Ecosystem (FAQ & Community) */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[150px] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
            <ScrollReveal className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-bold text-primary uppercase tracking-widest shadow-sm">
                <MessageCircle className="h-4 w-4 mr-2" /> Community
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Learn together,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-rose-400">grow faster</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">Free access doesn&apos;t mean learning alone. Join thousands of active learners.</p>
            </ScrollReveal>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
               {/* Community Card */}
               <ScrollReveal direction="left">
                 <div className="rounded-3xl border border-border/50 bg-card/80 p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                    <div className="absolute -inset-px bg-linear-to-br from-primary/10 via-transparent to-rose-500/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100 rounded-3xl" />
                    <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-5 mb-8">
                         <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-rose-500/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <MessageCircle className="w-8 h-8 text-primary" />
                         </div>
                         <div>
                           <h3 className="font-bold text-xl">Official Community</h3>
                           <p className="text-sm font-medium text-emerald-500 flex items-center gap-2 mt-0.5">
                             <span className="relative flex h-2.5 w-2.5">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                             </span>
                             1,402 currently online
                           </p>
                         </div>
                      </div>
                      
                      {/* Mini avatars */}
                      <div className="flex items-center mb-8">
                        <div className="flex -space-x-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-10 h-10 rounded-full border-2 border-card bg-linear-to-br from-primary to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                              {["SC", "MJ", "ER", "AL", "JL"][i]}
                            </div>
                          ))}
                        </div>
                        <span className="ml-4 text-sm text-muted-foreground font-medium">+2,847 members</span>
                      </div>
                      
                      <AnimatedShimmerButton className="w-full bg-primary rounded-xl shadow-lg shadow-primary/20">
                        <button className="w-full py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 flex items-center justify-center gap-2">
                          Join the Community <ArrowRight className="h-4 w-4" />
                        </button>
                      </AnimatedShimmerButton>
                    </div>
                 </div>
               </ScrollReveal>
               
               {/* FAQ */}
               <ScrollReveal direction="right">
                 <div className="space-y-4">
                    <h3 className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-6">Frequently Asked</h3>
                    {[
                      { q: "Is the platform actually free?", a: "Yes, 100%. All core curriculum, interactive quizzes, progress tracking, and standard certificates are completely open-access. No credit card required." },
                      { q: "Do I need prior experience?", a: "Not at all. Our Foundation path starts from absolute zero. Each module builds on the previous, so you never feel lost or overwhelmed." },
                      { q: "How are certificates verified?", a: "Each certificate includes a unique verification ID and public URL. Employers and recruiters can instantly verify your achievement." },
                      { q: "Can I learn at my own pace?", a: "Absolutely. All content is self-paced with no deadlines. Pick up right where you left off, anytime." }
                    ].map((faq, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ x: 4 }}
                        className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <h4 className="font-bold flex items-center justify-between gap-4">
                           <span className="group-hover:text-primary transition-colors">{faq.q}</span>
                           <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all shrink-0 group-hover:rotate-180" />
                        </h4>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </motion.div>
                    ))}
                 </div>
               </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="relative px-4 py-16 sm:px-6 mx-auto max-w-7xl">
          <ScrollReveal>
             <div className="bg-card border border-border/50 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
               {/* Ambient Glow */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] z-0" />
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] z-0" />

               <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                 <div>
                   <h2 className="font-extrabold text-4xl md:text-5xl text-foreground tracking-tight mb-6">
                     Ready to start <br/>
                     <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-rose-400">your journey?</span>
                   </h2>
                   <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
                     Join our newsletter to receive weekly insights, free course previews, and exclusive scholarship offers.
                   </p>
                   
                   <form className="flex flex-col sm:flex-row gap-3">
                     <input 
                       type="email" 
                       placeholder="Email address" 
                       className="bg-background border border-border/60 text-foreground rounded-full px-6 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none grow shadow-inner transition-shadow placeholder:text-muted-foreground" 
                     />
                     <AnimatedShimmerButton className="rounded-full bg-primary shadow-lg shadow-primary/20 shrink-0">
                       <button type="submit" className="flex h-full w-full items-center justify-center px-8 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                         Join Academy
                       </button>
                     </AnimatedShimmerButton>
                   </form>
                 </div>

                 <div className="hidden md:block relative">
                   <div className="aspect-video bg-background/50 rounded-3xl border border-border/50 p-3 backdrop-blur-md relative overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)] opacity-50" />
                     <div className="w-full h-full bg-secondary/20 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
                       <Image 
                         src="/images/hero-illustration.png" 
                         alt="Students learning" 
                         fill 
                         className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale-30 group-hover:grayscale-0 mix-blend-overlay" 
                       />
                       <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-border/50">
                         <PlayCircle className="text-primary h-8 w-8 ml-1" />
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer (shared component) */}
      <Footer />
    </div>
  );
}
