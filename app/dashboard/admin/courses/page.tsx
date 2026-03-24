"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { SkeletonTable } from "@/components/shared/SkeletonCard";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  teacherName: string | null;
  createdAt: Date;
  enrollmentCount: number;
};

export default function AdminCoursesPage() {
  const { data, isLoading } = trpc.admin.getCourses.useQuery({
    limit: 50,
    offset: 0,
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-amber-500/10 text-amber-500",
    PUBLISHED: "bg-green-500/10 text-green-500",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  const columns: ColumnDef<CourseRow>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "teacherName",
      header: "Teacher",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.teacherName ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
            statusColors[row.original.status] ?? ""
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "enrollmentCount",
      header: "Enrollments",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.enrollmentCount}</span>
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
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6">
          <PageHeader
            title="All courses"
            description={`${data?.total ?? 0} total courses`}
          />
          <div className="mt-6">
            {isLoading ? (
              <SkeletonTable />
            ) : (
              <DataTable
                columns={columns}
                data={(data?.courses as CourseRow[]) ?? []}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
