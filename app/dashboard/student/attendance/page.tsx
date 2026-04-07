"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnimatedPage } from "@/components/ui/animated";
import { formatDate } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Loader2,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export default function StudentAttendancePage() {
  const { data: records, isLoading } = trpc.attendance.getStudentAttendance.useQuery();

  function getStatusConfig(status: string) {
    switch (status) {
      case "PRESENT":
        return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Present" };
      case "LATE":
        return { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Late" };
      case "ABSENT":
        return { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Absent" };
      default:
        return { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Unmarked" };
    }
  }

  const presentCount = records?.filter((r) => r.status === "PRESENT").length ?? 0;
  const lateCount = records?.filter((r) => r.status === "LATE").length ?? 0;
  const absentCount = records?.filter((r) => r.status === "ABSENT").length ?? 0;
  const total = records?.length ?? 0;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6 lg:p-8 2xl:p-10 overflow-hidden">
          <AnimatedPage>
            <PageHeader
              title="My Attendance"
              description="View your attendance records across all classes"
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: "Total Sessions", count: total, color: "text-foreground", bg: "bg-muted/50" },
                    { label: "Present", count: presentCount, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Late", count: lateCount, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Absent", count: absentCount, color: "text-red-500", bg: "bg-red-500/10" },
                    { label: "Rate", count: `${attendanceRate}%`, color: "text-sky-500", bg: "bg-sky-500/10" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-xl ${stat.bg} p-4 text-center`}
                    >
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Records */}
                <div className="mt-6 space-y-2">
                  {!records?.length ? (
                    <div className="rounded-2xl border border-border/50 bg-card p-16 text-center">
                      <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-lg font-semibold text-muted-foreground">No records yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your attendance will appear here as teachers mark it.
                      </p>
                    </div>
                  ) : (
                    records.map((record, i) => {
                      const cfg = getStatusConfig(record.status);
                      const Icon = cfg.icon;
                      return (
                        <motion.div
                          key={`${record.sessionId}-${i}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 hover:border-border transition-all"
                        >
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                            <Icon className={`h-5 w-5 ${cfg.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">{record.sessionTitle}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {record.courseTitle} · {record.classCode}
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {formatDate(record.scheduledAt)}
                            </span>
                          </div>
                          <span className={`shrink-0 inline-flex items-center gap-1 rounded-md ${cfg.bg} px-2.5 py-1 text-[10px] font-bold ${cfg.color}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </AnimatedPage>
        </main>
      </div>
    </div>
  );
}
