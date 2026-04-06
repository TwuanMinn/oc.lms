"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loader2, Users as UsersIcon, BookOpen, TrendingUp, CreditCard, Activity, ArrowUpRight, Award } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "motion/react";
import { AnimatedPage } from "@/components/ui/animated";

export default function AdminAnalyticsPage() {
  const { data, isLoading } = trpc.admin.getAnalytics.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar role="ADMIN" />
          <main className="flex flex-1 items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </main>
        </div>
      </div>
    );
  }

  const chartData =
    data?.enrollmentsByDay?.map((d: { date: string; count: number }) => ({
      date: d.date.slice(5),
      enrollments: d.count,
    })) ?? [];

  // Mock revenue data for the bento grid charts
  const revenueData = chartData.map((d) => ({
    date: d.date,
    revenue: d.enrollments * 49, // Mock average ticket price
  }));

  const totalRevenue = data?.totalEnrollments ? data.totalEnrollments * 49 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 lg:p-8 2xl:p-10 overflow-hidden">
          <AnimatedPage>
            <PageHeader
              title="Platform Analytics"
              description="Real-time breakdown of growth, revenue, and engagement"
            />

            {/* BENTO GRID LAYOUT */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Highlight Metric: Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl border-2 border-primary/20 bg-linear-to-br from-card to-card/50 p-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" /> Max Revenue
                      </p>
                      <h2 className="text-4xl font-black tracking-tight text-foreground">
                        ${totalRevenue.toLocaleString()}
                      </h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-6 h-[80px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                          itemStyle={{ color: "hsl(var(--primary))" }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Standard Metric Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg flex flex-col justify-between relative group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-blue-500" /> Total Users
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mt-4">{data?.totalUsers ?? 0}</h3>
                  <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +12% this month
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg flex flex-col justify-between relative group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-rose-500" /> Active Enrollments
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mt-4">{data?.totalEnrollments ?? 0}</h3>
                  <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +8% this month
                  </p>
                </div>
              </motion.div>

              {/* Enrollment Bar Chart (Large Span) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-1 md:grid-cols-2 lg:col-span-3 rounded-2xl border border-border/50 bg-card p-6 shadow-lg"
              >
                <h3 className="mb-6 text-base font-semibold tracking-tight text-foreground">30-Day Enrollment Velocity</h3>
                <div className="h-[280px] w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                          itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                          labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
                        />
                        <Bar
                          dataKey="enrollments"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 4, 4]}
                          barSize={32}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      No enrollment data available
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Top Courses List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="col-span-1 md:col-span-2 lg:col-span-1 rounded-2xl border border-border/50 bg-card p-6 shadow-lg flex flex-col"
              >
                <h3 className="mb-6 text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" /> Leaderboard
                </h3>
                <div className="flex-1 space-y-4">
                  {(data?.topCourses as any[])?.slice(0, 5).map((course: any, idx: number) => (
                    <div key={course.courseId} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        idx === 0 ? "bg-amber-500/20 text-amber-500" :
                        idx === 1 ? "bg-slate-300/20 text-slate-400" :
                        idx === 2 ? "bg-amber-700/20 text-amber-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.enrollmentCount} enrollments</p>
                      </div>
                    </div>
                  )) ?? (
                    <p className="text-sm text-center text-muted-foreground py-10">No data yet</p>
                  )}
                </div>
              </motion.div>

            </div>
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
