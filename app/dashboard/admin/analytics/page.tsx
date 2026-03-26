"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loader2, Users as UsersIcon, BookOpen, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminAnalyticsPage() {
  const { data, isLoading } = trpc.admin.getAnalytics.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen">
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
      count: d.count,
    })) ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6">
          <PageHeader
            title="Analytics"
            description="Platform overview and metrics"
          />

          {/* Metric cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: UsersIcon, label: "Total users", value: data?.totalUsers ?? 0 },
              { icon: BookOpen, label: "Total courses", value: data?.totalCourses ?? 0 },
              { icon: TrendingUp, label: "Total enrollments", value: data?.totalEnrollments ?? 0 },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-border/50 bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top courses */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Top courses</h2>
            <div className="space-y-2">
              {data?.topCourses?.map((course: { courseId: string; title: string; enrollmentCount: number }, idx: number) => (
                <div
                  key={course.courseId}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{course.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {course.enrollmentCount} enrollments
                  </span>
                </div>
              )) ?? (
                <p className="text-sm text-muted-foreground">No data yet</p>
              )}
            </div>
          </div>

          {/* Enrollment chart with Recharts */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Enrollments (last 30 days)</h2>
            <div className="rounded-xl border border-border/50 bg-card p-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(240 3.7% 20%)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(240 5% 55%)" }}
                      tickLine={false}
                      axisLine={false}
                      width={30}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240 10% 10%)",
                        border: "1px solid hsl(240 3.7% 20%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(0 0% 95%)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(346.8 77.2% 49.8%)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No enrollment data yet
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
