"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Search, 
  UserCircle, 
  UserCog, 
  ArrowRight, 
  CreditCard, 
  GraduationCap, 
  ChevronRight, 
  Wrench, 
  MessageSquare, 
  FileText, 
  Mail, 
  MessageCircle 
} from "lucide-react";
import { motion } from "motion/react";
import { AnimatedPage, ScrollReveal, StaggerGrid, StaggerItem, AnimatedShimmerButton } from "@/components/ui/animated";
import Link from "next/link";
import Image from "next/image";

export default function HelpCenterPage() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-background">
      <Navbar />

      <AnimatedPage>
        <main className="mx-auto max-w-7xl flex-1 px-4 py-16 sm:px-6 relative z-10 w-full">
          
          {/* Hero Section */}
          <ScrollReveal>
             <section className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-24 sm:px-12 md:py-32 shadow-2xl mb-16">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-rose-400 blur-[80px]" />
              </div>
              
              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-5xl md:text-6xl font-extrabold tracking-tight"
                >
                  How can we help?
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 text-primary-foreground/80 md:text-xl text-lg leading-relaxed max-w-2xl mx-auto"
                >
                  Search through our digital atelier of knowledge to find answers to your questions about Green Academy.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-10 relative max-w-xl mx-auto group"
                >
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Describe your issue or ask a question..." 
                    className="w-full rounded-2xl border-none bg-background py-5 pl-14 pr-32 text-foreground shadow-xl placeholder:text-muted-foreground/60 focus:ring-4 focus:ring-primary/20 transition-all text-lg" 
                  />
                  <div className="absolute right-2 top-2 bottom-2">
                    <AnimatedShimmerButton className="h-full rounded-xl bg-primary">
                      <button className="flex h-full w-full items-center justify-center px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                        Search
                      </button>
                    </AnimatedShimmerButton>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex flex-wrap justify-center gap-4 text-sm"
                >
                  <span className="text-primary-foreground/60 font-medium">Popular:</span>
                  <Link href="#" className="text-white hover:underline underline-offset-4 font-medium transition-all">Reset password</Link>
                  <Link href="#" className="text-white hover:underline underline-offset-4 font-medium transition-all">Billing cycles</Link>
                  <Link href="#" className="text-white hover:underline underline-offset-4 font-medium transition-all">Course certification</Link>
                </motion.div>
              </div>
            </section>
          </ScrollReveal>

          {/* Categories Bento Grid */}
          <ScrollReveal>
             <StaggerGrid className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
                <StaggerItem className="md:col-span-2 md:row-span-2">
                  <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-card p-10 shadow-sm border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                      <UserCircle className="h-32 w-32 text-primary" strokeWidth={1} />
                    </div>
                    <div>
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <UserCog className="h-8 w-8" />
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight mb-4">Account & Profile</h3>
                      <p className="max-w-sm text-muted-foreground leading-relaxed mb-8">
                        Managing your credentials, profile visibility, and instructor verification processes.
                      </p>
                    </div>
                    <ul className="space-y-4 relative z-10">
                      <li>
                        <Link href="#" className="group/link flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-all">
                          Setting up your profile 
                          <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="group/link flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-all">
                          Two-factor authentication 
                          <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </StaggerItem>

                {[
                  {
                    icon: CreditCard,
                    bgClass: "bg-rose-500/10 text-rose-500",
                    title: "Billing & Payments",
                    desc: "Subscription plans, refunds, and tax documents.",
                    articles: 12
                  },
                  {
                    icon: GraduationCap,
                    bgClass: "bg-emerald-500/10 text-emerald-500",
                    title: "Learning Features",
                    desc: "Quizzes, assignments, and completion certificates.",
                    articles: 24
                  },
                  {
                    icon: Wrench,
                    bgClass: "bg-violet-500/10 text-violet-500",
                    title: "Technical Support",
                    desc: "Browser compatibility and app troubleshooting.",
                    articles: 8
                  },
                  {
                    icon: MessageSquare,
                    bgClass: "bg-amber-500/10 text-amber-500",
                    title: "Community Guidelines",
                    desc: "Interact safely and professionally with peers.",
                    articles: 6
                  }
                ].map((item, i) => (
                  <StaggerItem key={item.title}>
                    <div className="group flex h-full flex-col rounded-3xl bg-card p-8 shadow-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.bgClass}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold tracking-tight">{item.title}</h3>
                      <p className="mb-4 text-sm text-muted-foreground flex-1">{item.desc}</p>
                      <Link href="#" className="flex items-center text-sm font-semibold text-primary hover:text-primary/80 group/link">
                        View {item.articles} articles 
                        <ChevronRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </StaggerItem>
                ))}
             </StaggerGrid>
          </ScrollReveal>

          {/* Popular Articles Section */}
          <ScrollReveal>
            <section className="mb-24">
              <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-border/40">
                <h2 className="text-3xl font-extrabold tracking-tight">Trending Articles</h2>
                <Link href="#" className="hidden sm:flex items-center font-semibold text-primary hover:text-primary/80 group">
                  See all resources 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="grid gap-4">
                {[
                  { title: "How to apply for an Instructor License?", updated: "Updated 2 days ago", read: "5 min read" },
                  { title: "Integrating Green Academy with LinkedIn Learning", updated: "Updated 1 week ago", read: "10 min read" },
                  { title: "Managing Team Subscriptions for Businesses", updated: "Updated 3 days ago", read: "8 min read" },
                ].map((article, i) => (
                  <motion.div 
                    key={article.title}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="group cursor-pointer flex items-center justify-between rounded-2xl bg-card p-6 shadow-sm border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{article.updated} • {article.read}</p>
                      </div>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent group-hover:bg-primary/5 transition-colors">
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* CTA Contact Section */}
          <ScrollReveal>
             <section className="relative overflow-hidden rounded-[3rem] bg-card/80 backdrop-blur-sm border border-border/50 p-8 md:p-16 shadow-lg">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent -z-10" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                  <div className="max-w-xl space-y-6">
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                      Contact Support
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
                      Still looking for answers?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Our dedicated student success team is here to help you navigate your journey. Typical response time: under 2 hours.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                       <AnimatedShimmerButton className="rounded-full bg-primary shadow-lg shadow-primary/20">
                          <button className="flex h-full w-full items-center justify-center gap-2 px-8 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                            <Mail className="h-5 w-5" />
                            Contact Support
                          </button>
                       </AnimatedShimmerButton>
                       <button className="flex items-center gap-2 rounded-full border-2 border-border/60 bg-transparent px-8 py-4 font-bold text-foreground transition-all hover:bg-card hover:border-primary/40 hover:text-primary">
                         <MessageCircle className="h-5 w-5" />
                         Live Chat
                       </button>
                    </div>
                  </div>
                  
                  <div className="relative hidden md:block pt-8 pr-8">
                    <motion.div 
                       animate={{ y: [0, -10, 0] }}
                       transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                       className="relative z-10 h-72 w-72 overflow-hidden rounded-3xl shadow-2xl rotate-3 border-4 border-background bg-secondary/20 flex flex-col items-center justify-center text-muted-foreground"
                    >
                      <UserCog className="h-24 w-24 opacity-50" />
                      <span className="mt-4 font-semibold opacity-70 tracking-widest uppercase">Support Team</span>
                    </motion.div>
                    <div className="absolute bottom-0 left-0 h-40 w-40 -rotate-6 rounded-3xl bg-primary/20 blur-2xl" />
                  </div>
                </div>
             </section>
          </ScrollReveal>

        </main>
      </AnimatedPage>

      <Footer />
    </div>
  );
}
