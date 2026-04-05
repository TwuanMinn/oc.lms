"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonTable } from "@/components/shared/SkeletonCard";
import { motion } from "motion/react";
import { DollarSign, Download, Percent, Wallet } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  student_name: string;
  student_email: string;
  teacher_name: string;
  course_title: string;
  amount: number;
  platform_fee: number;
  teacher_payout: number;
  date: string;
  status: string;
}

export default function AdminTransactionsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading } = trpc.admin.getTransactions.useQuery({
    limit: 100,
    offset: 0,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const transactions = (data?.transactions ?? []) as unknown as Transaction[];
  const summary = (data?.summary ?? {}) as unknown as Record<string, number>;

  const handleExportCSV = () => {
    if (!transactions.length) return;
    const headers = ["Student", "Teacher", "Course", "Amount", "Platform Fee", "Teacher Payout", "Date", "Status"];
    const rows = transactions.map((t) => [
      t.student_name,
      t.teacher_name,
      t.course_title,
      t.amount.toFixed(2),
      t.platform_fee.toFixed(2),
      t.teacher_payout.toFixed(2),
      new Date(t.date).toISOString().split("T")[0],
      t.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${(summary.total_revenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      iconBg: "bg-emerald-500/10",
      color: "text-emerald-500",
    },
    {
      icon: Percent,
      label: "Platform Fees (10%)",
      value: `$${(summary.total_platform_fees ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      iconBg: "bg-amber-500/10",
      color: "text-amber-500",
    },
    {
      icon: Wallet,
      label: "Teacher Payouts (90%)",
      value: `$${(summary.total_teacher_payouts ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      iconBg: "bg-blue-500/10",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        description="Revenue and payment tracking"
        action={
          <button
            onClick={handleExportCSV}
            disabled={!transactions.length}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Date Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => { setDateFrom(""); setDateTo(""); }}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Clear
          </button>
        )}
      </motion.div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payout</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium">{t.student_name}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.teacher_name}</td>
                      <td className="px-4 py-3">
                        <p className="max-w-[180px] truncate font-medium">{t.course_title}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">${t.amount?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-amber-500">${t.platform_fee?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-emerald-500">${t.teacher_payout?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(t.date)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
