"use client";

import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const CHART_COLORS = {
  primary: "hsl(346.8 77.2% 49.8%)",
  teal: "hsl(172 66% 50%)",
  amber: "hsl(38 92% 50%)",
  blue: "hsl(217 91% 60%)",
  emerald: "hsl(142 71% 45%)",
  muted: "hsl(240 3.7% 20%)",
  text: "hsl(240 5% 55%)",
  bg: "hsl(240 10% 10%)",
  border: "hsl(240 3.7% 20%)",
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.blue, CHART_COLORS.emerald];

const tooltipStyle = {
  backgroundColor: CHART_COLORS.bg,
  border: `1px solid ${CHART_COLORS.border}`,
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(0 0% 95%)",
};

export default function AdminReportsPage() {
  const { data, isLoading } = trpc.admin.getReportData.useQuery();

  const monthlyRevenue = (data?.monthlyRevenue ?? []) as { month: string; revenue: number }[];
  const topCourses = (data?.topCourses ?? []) as { title: string; enrollment_count: number }[];
  const userDist = (data?.userDistribution ?? []) as { role: string; count: number }[];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" description="Analytics and insights" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-[340px] animate-pulse rounded-xl bg-muted ${i === 0 ? "lg:col-span-2" : ""}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Reports" description="Platform analytics and insights" />

      {/* Monthly Revenue - Line Chart (full width) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border/50 bg-card p-5"
      >
        <h2 className="mb-1 text-sm font-semibold">Monthly Revenue</h2>
        <p className="mb-4 text-xs text-muted-foreground">Last 12 months</p>
        {monthlyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.muted} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: CHART_COLORS.text }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: CHART_COLORS.text }}
                tickLine={false}
                axisLine={false}
                width={50}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.emerald}
                strokeWidth={2.5}
                dot={{ fill: CHART_COLORS.emerald, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">No revenue data yet</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Courses - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <h2 className="mb-1 text-sm font-semibold">Top Courses by Enrollment</h2>
          <p className="mb-4 text-xs text-muted-foreground">Top 5 most popular</p>
          {topCourses.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topCourses} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHART_COLORS.muted} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: CHART_COLORS.text }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  tick={{ fontSize: 10, fill: CHART_COLORS.text }}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  tickFormatter={(v) => (v.length > 18 ? v.slice(0, 18) + "…" : v)}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="enrollment_count"
                  fill={CHART_COLORS.blue}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={28}
                  name="Enrollments"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">No data yet</p>
          )}
        </motion.div>

        {/* User Distribution - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card p-5"
        >
          <h2 className="mb-1 text-sm font-semibold">User Distribution</h2>
          <p className="mb-4 text-xs text-muted-foreground">By role</p>
          {userDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={userDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="role"
                  label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {userDist.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">No data yet</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
