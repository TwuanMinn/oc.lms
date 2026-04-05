"use client";

import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonTable } from "@/components/shared/SkeletonCard";
import { motion } from "motion/react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent: string;
  iconBg: string;
}

function StatCard({ icon: Icon, label, value, accent, iconBg }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.07]" style={{ background: accent }} />
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <SkeletonTable />
      </div>
    );
  }

  const stats: StatCardProps[] = [
    {
      icon: Users,
      label: "Total Users",
      value: data?.totalUsers ?? 0,
      accent: "hsl(172, 66%, 50%)",
      iconBg: "bg-teal-500/10",
    },
    {
      icon: BookOpen,
      label: "Published Courses",
      value: data?.totalCourses ?? 0,
      accent: "hsl(142, 71%, 45%)",
      iconBg: "bg-emerald-500/10",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${(data?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      accent: "hsl(38, 92%, 50%)",
      iconBg: "bg-amber-500/10",
    },
    {
      icon: TrendingUp,
      label: "New Enrollments (This Month)",
      value: data?.newEnrollments ?? 0,
      accent: "hsl(217, 91%, 60%)",
      iconBg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="Platform administration at a glance" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-border/50 bg-card"
        >
          <div className="border-b border-border/50 px-5 py-4">
            <h2 className="text-sm font-semibold">Latest Registrations</h2>
            <p className="text-xs text-muted-foreground">Most recent user sign-ups</p>
          </div>
          <div className="divide-y divide-border/30">
            {data?.latestUsers?.length ? (
              data.latestUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-red-500/10 text-red-500"
                        : user.role === "TEACHER"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-emerald-500/10 text-emerald-500"
                    }`}>
                      {user.role}
                    </span>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
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
          transition={{ delay: 0.45 }}
          className="rounded-xl border border-border/50 bg-card"
        >
          <div className="border-b border-border/50 px-5 py-4">
            <h2 className="text-sm font-semibold">Latest Published Courses</h2>
            <p className="text-xs text-muted-foreground">Recently published on the platform</p>
          </div>
          <div className="divide-y divide-border/30">
            {data?.latestCourses?.length ? (
              data.latestCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      by {course.teacherName ?? "Unknown"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(course.createdAt)}
                  </p>
                </div>
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
