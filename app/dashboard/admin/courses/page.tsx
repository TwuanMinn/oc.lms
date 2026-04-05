"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { SkeletonTable } from "@/components/shared/SkeletonCard";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Check, X, EyeOff, Trash2 } from "lucide-react";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  price: string;
  status: string;
  approved: boolean;
  teacherName: string | null;
  categoryName: string | null;
  createdAt: Date;
  enrollmentCount: number;
};

export default function AdminCoursesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading } = trpc.admin.getCourses.useQuery({
    limit: 50,
    offset: 0,
    status: (statusFilter || undefined) as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
  });

  const utils = trpc.useUtils();

  const approve = trpc.admin.approveCourse.useMutation({
    onSuccess: () => { utils.admin.getCourses.invalidate(); toast.success("Course approved"); },
    onError: (err) => toast.error(err.message),
  });
  const reject = trpc.admin.rejectCourse.useMutation({
    onSuccess: () => { utils.admin.getCourses.invalidate(); toast.success("Course rejected"); },
    onError: (err) => toast.error(err.message),
  });
  const unpublish = trpc.admin.forceUnpublishCourse.useMutation({
    onSuccess: () => { utils.admin.getCourses.invalidate(); toast.success("Course unpublished"); },
    onError: (err) => toast.error(err.message),
  });
  const deleteCourse = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => { utils.admin.getCourses.invalidate(); toast.success("Course deleted"); },
    onError: (err) => toast.error(err.message),
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-amber-500/10 text-amber-500",
    PUBLISHED: "bg-emerald-500/10 text-emerald-500",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  const columns: ColumnDef<CourseRow>[] = [
    {
      accessorKey: "title",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.thumbnail ? (
            <img
              src={row.original.thumbnail}
              alt=""
              className="h-9 w-14 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="h-9 w-14 shrink-0 rounded-md bg-muted" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.original.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              by {row.original.teacherName ?? "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.categoryName ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          ${parseFloat(row.original.price || "0").toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "enrollmentCount",
      header: "Enrolled",
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.enrollmentCount}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusColors[row.original.status] ?? ""}`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "approved",
      header: "Approved",
      cell: ({ row }) => (
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
            row.original.approved
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {row.original.approved ? "Yes" : "Pending"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {!row.original.approved && (
            <button
              onClick={() => approve.mutate({ courseId: row.original.id })}
              title="Approve"
              className="rounded-md p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          {row.original.approved && (
            <button
              onClick={() => reject.mutate({ courseId: row.original.id })}
              title="Reject"
              className="rounded-md p-1.5 text-amber-500 transition-colors hover:bg-amber-500/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {row.original.status === "PUBLISHED" && (
            <button
              onClick={() => unpublish.mutate({ courseId: row.original.id })}
              title="Force unpublish"
              className="rounded-md p-1.5 text-blue-500 transition-colors hover:bg-blue-500/10"
            >
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Delete this course?")) deleteCourse.mutate({ courseId: row.original.id });
            }}
            title="Delete"
            className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description={`${data?.total ?? 0} total courses`}
      />

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable columns={columns} data={(data?.courses as CourseRow[]) ?? []} />
        )}
      </motion.div>
    </div>
  );
}
