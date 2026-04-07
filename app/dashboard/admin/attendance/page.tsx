"use client";

import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnimatedPage } from "@/components/ui/animated";
import { formatDate } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Loader2,
  ClipboardList,
  CalendarDays,
  Users,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function AdminAttendanceReportPage() {
  const [courseId, setCourseId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: coursesData } = trpc.admin.getCourses.useQuery({
    limit: 100,
    offset: 0,
    status: "PUBLISHED",
  });

  const { data: report, isLoading } = trpc.admin.getAttendanceReport.useQuery(
    {
      courseId: courseId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    },
  );

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

  async function exportPdf() {
    if (!report || report.length === 0) return;

    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Attendance Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    if (courseId) {
      const course = coursesData?.courses?.find((c) => c.id === courseId);
      if (course) doc.text(`Course: ${course.title}`, 14, 34);
    }

    autoTable(doc, {
      startY: courseId ? 40 : 34,
      head: [["Student", "ID", "Session", "Date", "Status"]],
      body: report.map((r) => [
        r.studentName,
        r.studentId || "—",
        r.sessionTitle,
        new Date(r.scheduledAt).toLocaleDateString(),
        r.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [14, 165, 233] },
    });

    // Summary at the bottom
    const presentCount = report.filter((r) => r.status === "PRESENT").length;
    const lateCount = report.filter((r) => r.status === "LATE").length;
    const absentCount = report.filter((r) => r.status === "ABSENT").length;

    // Get Y position after table
    const finalY = (doc as any).lastAutoTable?.finalY ?? 200;
    doc.setFontSize(10);
    doc.text(`Summary — Present: ${presentCount} | Late: ${lateCount} | Absent: ${absentCount}`, 14, finalY + 10);

    doc.save("attendance_report.pdf");
  }

  // Stats
  const presentCount = report?.filter((r) => r.status === "PRESENT").length ?? 0;
  const lateCount = report?.filter((r) => r.status === "LATE").length ?? 0;
  const absentCount = report?.filter((r) => r.status === "ABSENT").length ?? 0;

  return (
    <div className="space-y-6">
      <AnimatedPage>
        <div className="flex items-center justify-between">
          <PageHeader
            title="Attendance Report"
            description="View and export attendance records across all courses"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={exportPdf}
            disabled={!report?.length}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </motion.button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3">
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">All Courses</option>
            {coursesData?.courses?.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        {/* Summary Stats */}
        {report && report.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Records", count: report.length, color: "text-foreground", bg: "bg-muted/50" },
              { label: "Present", count: presentCount, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Late", count: lateCount, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Absent", count: absentCount, color: "text-red-500", bg: "bg-red-500/10" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl ${stat.bg} p-4 text-center`}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !report?.length ? (
            <div className="px-5 py-16 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm font-semibold text-muted-foreground">No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Course</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Session</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {report.map((row, i) => {
                    const cfg = getStatusConfig(row.status);
                    const Icon = cfg.icon;
                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className="hover:bg-muted/10"
                      >
                        <td className="px-4 py-2.5 font-medium">{row.studentName}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.studentId || "—"}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{row.courseTitle}</td>
                        <td className="px-4 py-2.5">{row.sessionTitle}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {new Date(row.scheduledAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center gap-1.5 rounded-md ${cfg.bg} px-2 py-0.5 text-[10px] font-bold ${cfg.color}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AnimatedPage>
    </div>
  );
}
