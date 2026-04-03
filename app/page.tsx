"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, Zap, Users, Award, TrendingUp, Star, Quote, PlayCircle, Clock } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
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
  springBounce,
} from "@/lib/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/hooks/useAuth";

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

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], [0, -120]);
  const heroBgY = useTransform(scrollY, [0, 800], [0, 250]);

  return (
    <div className="relative min-h-screen">
      {/* Background ambient glow */}
      <motion.div style={{ y: heroBgY }} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
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
      </motion.div>

      {/* Navbar (shared component) */}
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6">
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
                  className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent"
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
              <div className="relative w-full max-w-lg aspect-square bg-gradient-to-br from-card to-background rounded-[2.5rem] shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden border border-border/50">
                <Image
                  src="/images/hero-illustration.png"
                  alt="Online learning platform"
                  fill
                  className="object-cover rounded-3xl grayscale-[15%] hover:grayscale-0 transition-all duration-700 p-2"
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

            <StaggerGrid className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <StaggerItem key={feature.title} scale>
                  <motion.div
                    whileHover={{
                      y: -8,
                    }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/80 p-8 pt-10 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.15)]"
                  >
                    {/* Hover Glow Background */}
                    <div className="absolute -inset-px bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <div className="relative mb-8 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <div className="relative flex grow flex-col">
                      <h3 className="mb-3 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
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
                  <motion.div 
                    whileHover={{ y: -6, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.1)" }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/60 shadow-sm backdrop-blur-md transition-all hover:border-primary/30 cursor-pointer"
                  >
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
                  </motion.div>
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
                    className="relative w-[320px] shrink-0 rounded-2xl border border-border/50 bg-card p-6 shadow-sm mr-6 flex flex-col justify-between"
                  >
                    <div>
                      <Quote className="absolute right-4 top-4 h-6 w-6 text-primary/10" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover shadow-sm bg-accent/50"
                      />
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </InfiniteMarquee>
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
