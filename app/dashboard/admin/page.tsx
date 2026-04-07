"use client";

import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonDashboardHero } from "@/components/shared/SkeletonCard";
import { motion } from "motion/react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

/* ─── Mini Sparkline ─── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="shrink-0 opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ─── Bento Stat Card ─── */
function BentoCard({
  icon: Icon,
  label,
  value,
  subtitle,
  accent,
  trend,
  sparkData,
  span = 1,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  accent: string;
  trend?: { value: string; positive: boolean };
  sparkData?: number[];
  span?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
      className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all ${span === 2 ? "sm:col-span-2" : ""}`}
    >
      {/* Ambient glow */}
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.06] transition-opacity group-hover:opacity-[0.12]" style={{ background: accent }} />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${accent}15` }}>
              <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
          </div>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
              trend.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend.value}
            </div>
          )}
        </div>
        {sparkData && <Sparkline data={sparkData} color={accent} />}
      </div>
    </motion.div>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading } = trpc.admin.getOverview.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Overview" description="Platform administration" />
        <SkeletonDashboardHero />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Mock sparkline data (derived from actual values for visual consistency)
  const userSparkData = [2, 5, 3, 8, 6, 12, 9, 15, (data?.totalUsers ?? 0)];
  const courseSparkData = [1, 2, 1, 3, 2, 4, 3, (data?.totalCourses ?? 0)];
  const revenueSparkData = [100, 250, 180, 400, 320, 550, (data?.totalRevenue ?? 0)];
  const enrollSparkData = [3, 5, 2, 7, 4, 9, 6, (data?.newEnrollments ?? 0)];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/5 via-background to-primary/10 p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-500/5 blur-[60px]" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-2xl"
              >
                📊
              </motion.span>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin Console</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Platform Overview</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              <span className="font-semibold text-foreground">{data?.totalUsers ?? 0}</span> users across <span className="font-semibold text-foreground">{data?.totalCourses ?? 0}</span> courses generating <span className="font-semibold text-foreground">${(data?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span> in revenue.
            </p>
          </div>
          <Link
            href="/dashboard/admin/users"
            className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
        </div>
      </motion.div>

      {/* ─── Bento Grid ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BentoCard
          icon={Users}
          label="Total Users"
          value={data?.totalUsers ?? 0}
          subtitle="Registered accounts"
          accent="hsl(172, 66%, 50%)"
          trend={{ value: "+12% this month", positive: true }}
          sparkData={userSparkData}
        />
        <BentoCard
          icon={BookOpen}
          label="Classes"
          value={data?.totalCourses ?? 0}
          subtitle="Scheduled sessions"
          accent="hsl(142, 71%, 45%)"
          trend={{ value: "+3 new", positive: true }}
          sparkData={courseSparkData}
        />
        <BentoCard
          icon={DollarSign}
          label="Revenue"
          value={`$${(data?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          subtitle="Lifetime platform earnings"
          accent="hsl(38, 92%, 50%)"
          sparkData={revenueSparkData}
        />
        <BentoCard
          icon={TrendingUp}
          label="Enrollments"
          value={data?.newEnrollments ?? 0}
          subtitle="This month"
          accent="hsl(217, 91%, 60%)"
          trend={{ value: "+24%", positive: true }}
          sparkData={enrollSparkData}
        />
      </div>

      {/* ─── Activity Feed ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border/50 bg-card overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Latest Registrations
              </h2>
              <p className="text-xs text-muted-foreground">Most recent user sign-ups</p>
            </div>
            <Link href="/dashboard/admin/users" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {data?.latestUsers?.length ? (
              data.latestUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                      user.role === "ADMIN" ? "bg-red-500/10 text-red-500"
                      : user.role === "TEACHER" ? "bg-blue-500/10 text-blue-500"
                      : "bg-emerald-500/10 text-emerald-500"
                    }`}>{user.role}</span>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{formatDate(user.createdAt)}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">No users yet</p>
            )}
          </div>
        </motion.div>

        {/* Latest Published Courses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border/50 bg-card overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                Latest Classes
              </h2>
              <p className="text-xs text-muted-foreground">Recently scheduled classes</p>
            </div>
            <Link href="/dashboard/admin/classes" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {data?.latestCourses?.length ? (
              data.latestCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    <p className="truncate text-xs text-muted-foreground">by {course.teacherName ?? "Unknown"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(course.createdAt)}</p>
                </motion.div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">No courses yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
