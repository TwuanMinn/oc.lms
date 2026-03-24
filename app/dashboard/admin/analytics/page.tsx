"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loader2, Users as UsersIcon, BookOpen, TrendingUp } from "lucide-react";

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

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <UsersIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data?.totalUsers ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total users</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{data?.totalCourses ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total courses</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {data?.totalEnrollments ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total enrollments
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Top courses</h2>
            <div className="space-y-2">
              {data?.topCourses?.map((course, idx) => (
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

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Enrollments (last 30 days)</h2>
            <div className="rounded-xl border border-border/50 bg-card p-4">
              {data?.enrollmentsByDay && data.enrollmentsByDay.length > 0 ? (
                <div className="flex h-36 items-end gap-1">
                  {data.enrollmentsByDay.map((day) => {
                    const maxCount = Math.max(
                      ...data.enrollmentsByDay.map((d) => d.count)
                    );
                    const height =
                      maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    return (
                      <div
                        key={day.date}
                        className="group relative flex-1"
                        title={`${day.date}: ${day.count}`}
                      >
                        <div
                          className="w-full rounded-t bg-primary/70 transition-colors hover:bg-primary"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
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
