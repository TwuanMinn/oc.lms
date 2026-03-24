"use client";

import { trpc } from "@/lib/trpc/client";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { SkeletonTable } from "@/components/shared/SkeletonCard";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  emailVerified: boolean;
  createdAt: Date;
};

export default function AdminUsersPage() {
  const { data, isLoading } = trpc.admin.getUsers.useQuery({
    limit: 50,
    offset: 0,
  });

  const utils = trpc.useUtils();
  const updateRole = trpc.admin.updateRole.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("Role updated");
    },
    onError: (err) => toast.error(err.message),
  });

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const colors = {
          ADMIN: "bg-red-500/10 text-red-500",
          TEACHER: "bg-blue-500/10 text-blue-500",
          STUDENT: "bg-green-500/10 text-green-500",
        };
        return (
          <select
            value={role}
            onChange={(e) =>
              updateRole.mutate({
                userId: row.original.id,
                role: e.target.value as "ADMIN" | "TEACHER" | "STUDENT",
              })
            }
            className={`rounded-md border-0 px-2 py-1 text-xs font-medium ${colors[role]} bg-transparent outline-none`}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
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
            title="Users"
            description={`${data?.total ?? 0} total users`}
          />
          <div className="mt-6">
            {isLoading ? (
              <SkeletonTable />
            ) : (
              <DataTable
                columns={columns}
                data={(data?.users as UserRow[]) ?? []}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
