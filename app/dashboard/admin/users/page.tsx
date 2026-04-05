"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { SkeletonTable } from "@/components/shared/SkeletonCard";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserPlus,
  X,
  Loader2,
} from "lucide-react";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  avatar: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
};

function CreateUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | "ADMIN">("STUDENT");

  const utils = trpc.useUtils();

  const createUser = trpc.admin.createUser.useMutation({
    onSuccess: (data) => {
      utils.admin.getUsers.invalidate();
      utils.admin.getOverview.invalidate();
      toast.success(`User "${data.name}" created successfully`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("STUDENT");
      onClose();
    },
    onError: (err) => {
      const msg = err.message;
      if (msg.includes("unique") || msg.includes("duplicate")) {
        toast.error("A user with this email already exists");
      } else {
        toast.error(msg);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate({ name, email, password, role });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Create New User</h2>
                <p className="text-xs text-muted-foreground">
                  Add a new user to the platform
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="create-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Full Name
                </label>
                <input
                  id="create-name"
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="create-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="create-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="create-password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="create-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="create-role"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Role
                </label>
                <select
                  id="create-role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "STUDENT" | "TEACHER" | "ADMIN")
                  }
                  className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-border/50 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {createUser.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {createUser.isPending ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading } = trpc.admin.getUsers.useQuery({
    limit: 50,
    offset: 0,
    role: (roleFilter || undefined) as
      | "ADMIN"
      | "TEACHER"
      | "STUDENT"
      | undefined,
    search: debouncedSearch || undefined,
  });

  const utils = trpc.useUtils();

  const updateRole = trpc.admin.updateRole.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("Role updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  const banUser = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("User banned");
    },
    onError: (err) => toast.error(err.message),
  });

  const unbanUser = trpc.admin.unbanUser.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("User unbanned");
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("User deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(
      (globalThis as Record<string, unknown>).__searchTimer as number
    );
    (globalThis as Record<string, unknown>).__searchTimer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-500/10 text-red-500",
    TEACHER: "bg-blue-500/10 text-blue-500",
    STUDENT: "bg-emerald-500/10 text-emerald-500",
  };

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {row.original.avatar ? (
              <img
                src={row.original.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <select
          value={row.original.role}
          onChange={(e) =>
            updateRole.mutate({
              userId: row.original.id,
              role: e.target.value as "ADMIN" | "TEACHER" | "STUDENT",
            })
          }
          className={`cursor-pointer rounded-md border-0 px-2 py-1 text-xs font-semibold ${roleColors[row.original.role] ?? ""} bg-transparent outline-none transition-colors`}
        >
          <option value="STUDENT">STUDENT</option>
          <option value="TEACHER">TEACHER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isBanned = row.original.status === "banned";
        return (
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
              isBanned
                ? "bg-red-500/10 text-red-500"
                : "bg-emerald-500/10 text-emerald-500"
            }`}
          >
            {isBanned ? "Banned" : "Active"}
          </span>
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isBanned = row.original.status === "banned";
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                isBanned
                  ? unbanUser.mutate({ userId: row.original.id })
                  : banUser.mutate({ userId: row.original.id })
              }
              title={isBanned ? "Unban user" : "Ban user"}
              className={`rounded-md p-1.5 transition-colors ${
                isBanned
                  ? "text-emerald-500 hover:bg-emerald-500/10"
                  : "text-amber-500 hover:bg-amber-500/10"
              }`}
            >
              {isBanned ? (
                <Shield className="h-3.5 w-3.5" />
              ) : (
                <ShieldOff className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={() => {
                if (
                  confirm("Delete this user? This action cannot be undone.")
                ) {
                  deleteUser.mutate({ userId: row.original.id });
                }
              }}
              title="Delete user"
              className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description={`${data?.total ?? 0} total users on the platform`}
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </button>
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9 w-64 rounded-lg border border-border/50 bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-9 rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
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
          <DataTable
            columns={columns}
            data={(data?.users as UserRow[]) ?? []}
          />
        )}
      </motion.div>

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
