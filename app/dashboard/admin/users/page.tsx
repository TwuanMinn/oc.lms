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
// jsPDF & autotable are imported dynamically inside the export handler
// to avoid SSR crashes (they depend on browser APIs like window/document)
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserPlus,
  Upload,
  X,
  Loader2,
  Eye,
  EyeOff,
  Pencil,
  ExternalLink,
  Pin,
  Download,
  FileDown,
} from "lucide-react";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  dateOfBirth?: string | null;
  avatar: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  plainTextPassword?: string | null;
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
  const [password, setPassword] = useState("Admin123!");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | "ADMIN">("STUDENT");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "">("MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const utils = trpc.useUtils();

  const createUser = trpc.admin.createUser.useMutation({
    onSuccess: (data) => {
      utils.admin.getUsers.invalidate();
      utils.admin.getOverview.invalidate();
      toast.success(`User "${data.name}" created successfully`);
      setName("");
      setEmail("");
      setPassword("Admin123!");
      setShowPassword(false);
      setRole("STUDENT");
      setGender("MALE");
      setDateOfBirth("");
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
    createUser.mutate({ name, email, password, role, gender: gender || undefined, dateOfBirth: dateOfBirth || undefined });
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
                <div className="relative">
                  <input
                    id="create-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 pr-10 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label
                    htmlFor="create-gender"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Gender
                  </label>
                  <select
                    id="create-gender"
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as "MALE" | "FEMALE" | "OTHER" | "")
                    }
                    className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50"
                  >
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="create-dob" className="mb-1.5 block text-sm font-medium">
                  Date of Birth
                </label>
                <input
                  id="create-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
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

function ImportCSVModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<{ name: string; email: string; role: string; studentId: string; password: string }[]>([]);
  const [step, setStep] = useState<"upload" | "preview">("upload");

  const utils = trpc.useUtils();

  const importCsv = trpc.admin.importCsv.useMutation({
    onSuccess: (data) => {
      utils.admin.getUsers.invalidate();
      utils.admin.getOverview.invalidate();
      if (data.errors && data.errors.length > 0) {
        toast.warning(`Imported ${data.created} users. ${data.errors.length} error(s): ${data.errors.slice(0, 3).join(", ")}${data.errors.length > 3 ? "..." : ""}`);
      } else {
        toast.success(`Successfully imported ${data.created} users`);
      }
      handleReset();
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleReset() {
    setFile(null);
    setError(null);
    setParsedRows([]);
    setStep("upload");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "text/csv" && !selected.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file");
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
      setParsedRows([]);
      setStep("upload");
    }
  };

  const handleParse = () => {
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string).replace(/^\uFEFF/, ""); // strip BOM
        const lines = text.split(/\r?\n/).filter((line) => line.trim());

        if (lines.length < 2) {
          setError("CSV must have a header row + at least one data row");
          return;
        }

        // Auto-detect delimiter
        const firstLine = lines[0];
        let delimiter = ",";
        if (firstLine.includes("\t")) delimiter = "\t";
        else if (firstLine.includes(";") && !firstLine.includes(",")) delimiter = ";";

        const headers = firstLine
          .split(delimiter)
          .map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
        const allValues = lines.slice(1).map((line) =>
          line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ""))
        );

        // 1) Header-based column detection
        let nameIdx = headers.findIndex((h) =>
          ["name", "full name", "fullname", "student name", "user", "username"].includes(h)
        );
        let emailIdx = headers.findIndex((h) =>
          ["email", "e-mail", "mail", "email address"].includes(h)
        );
        let roleIdx = headers.findIndex((h) =>
          ["role", "type", "user role", "account type"].includes(h)
        );
        let idIdx = headers.findIndex((h) =>
          ["id", "student id", "studentid", "student_id", "user id", "userid"].includes(h)
        );
        let pwIdx = headers.findIndex((h) =>
          ["password", "pass", "pwd", "passcode"].includes(h)
        );

        // 2) Content-based fallback: find email column by @ symbol
        if (emailIdx === -1) {
          for (let col = 0; col < (allValues[0]?.length ?? 0); col++) {
            const hasAt = allValues.slice(0, 5).some((row) => row[col]?.includes("@"));
            if (hasAt) {
              emailIdx = col;
              break;
            }
          }
        }

        // 3) Content-based fallback: find role column by known values
        if (roleIdx === -1) {
          for (let col = 0; col < (allValues[0]?.length ?? 0); col++) {
            if (col === emailIdx) continue;
            const hasRole = allValues
              .slice(0, 5)
              .some((row) => ["STUDENT", "TEACHER", "ADMIN"].includes(row[col]?.toUpperCase()));
            if (hasRole) {
              roleIdx = col;
              break;
            }
          }
        }

        // 4) Assign remaining unresolved columns
        const usedCols = new Set(
          [nameIdx, emailIdx, roleIdx, idIdx, pwIdx].filter((i) => i !== -1)
        );
        const freeCols = Array.from({ length: headers.length }, (_, i) => i).filter(
          (i) => !usedCols.has(i)
        );

        if (nameIdx === -1 && freeCols.length > 0) nameIdx = freeCols.shift()!;
        if (pwIdx === -1 && freeCols.length > 0) pwIdx = freeCols.shift()!;
        if (idIdx === -1 && freeCols.length > 0) idIdx = freeCols.shift()!;

        if (emailIdx === -1 || nameIdx === -1 || pwIdx === -1) {
          const missing = [];
          if (nameIdx === -1) missing.push("name");
          if (emailIdx === -1) missing.push("email");
          if (pwIdx === -1) missing.push("password");
          setError(
            `Could not detect columns: ${missing.join(", ")}.\nHeaders found: [${headers.join(", ")}]\nMake sure your CSV has: name, email, role, id, password`
          );
          return;
        }

        const rows = allValues
          .map((values) => ({
            name: values[nameIdx]?.trim() || "",
            email: values[emailIdx]?.trim() || "",
            role:
              roleIdx !== -1
                ? values[roleIdx]?.trim().toUpperCase() || "STUDENT"
                : "STUDENT",
            studentId: idIdx !== -1 ? values[idIdx]?.trim() || "" : "",
            password: values[pwIdx]?.trim() || "",
          }))
          .filter((r) => r.name && r.email && r.password);

        if (rows.length === 0) {
          setError("No valid rows found. Each row needs at least name, email, and password.");
          return;
        }

        setParsedRows(rows);
        setStep("preview");
      } catch {
        setError("Failed to parse CSV. Check the file format.");
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    importCsv.mutate({ rows: parsedRows });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg rounded-xl border border-border/50 bg-card p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Import Users</h2>
                <p className="text-xs text-muted-foreground">
                  {step === "upload"
                    ? "Upload a CSV file to bulk create users"
                    : `Preview: ${parsedRows.length} users to import`}
                </p>
              </div>
              <button
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ─── Step 1: Upload ─── */}
            {step === "upload" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                  >
                    <Upload className="h-6 w-6" />
                  </label>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Click to select CSV file</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Headers: name, email, role, id, password
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      Auto-detects columns &amp; delimiters (comma, semicolon, tab)
                    </p>
                    {file && (
                      <p className="mt-3 text-sm font-semibold text-primary">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 whitespace-pre-wrap">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      onClose();
                    }}
                    className="flex-1 rounded-lg border border-border/50 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleParse}
                    disabled={!file}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    Parse &amp; Preview
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step 2: Preview ─── */}
            {step === "preview" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">#</th>
                          <th className="px-3 py-2 text-left font-semibold">Name</th>
                          <th className="px-3 py-2 text-left font-semibold">Email</th>
                          <th className="px-3 py-2 text-left font-semibold">Role</th>
                          <th className="px-3 py-2 text-left font-semibold">ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-t border-border/30">
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {i + 1}
                            </td>
                            <td className="px-3 py-1.5 font-medium">{row.name}</td>
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {row.email}
                            </td>
                            <td className="px-3 py-1.5">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                  row.role === "ADMIN"
                                    ? "bg-red-500/10 text-red-500"
                                    : row.role === "TEACHER"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-emerald-500/10 text-emerald-500"
                                }`}
                              >
                                {row.role}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {row.studentId || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedRows.length > 10 && (
                    <div className="border-t border-border/30 px-3 py-2 text-[10px] text-muted-foreground text-center">
                      ... and {parsedRows.length - 10} more rows
                    </div>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 whitespace-pre-wrap">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("upload");
                      setParsedRows([]);
                      setError(null);
                    }}
                    className="flex-1 rounded-lg border border-border/50 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    disabled={importCsv.isPending}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {importCsv.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    {importCsv.isPending
                      ? "Importing..."
                      : `Import ${parsedRows.length} Users`}
                  </button>
                </div>
              </div>
            )}
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
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [pinnedUsers, setPinnedUsers] = useState<Set<string>>(new Set());
  const [previewUser, setPreviewUser] = useState<UserRow | null>(null);

  const { data, isLoading } = trpc.admin.getUsers.useQuery({
    limit: 200,
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

  const updateUser = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      utils.admin.getUsers.invalidate();
      toast.success("User updated successfully");
      setEditingUser(null);
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
    ADMIN: "bg-red-500/10 text-red-500 border border-red-500/20",
    TEACHER: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    STUDENT: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  };

  const columns: ColumnDef<UserRow>[] = [
    {
      id: "rowId",
      header: "ID",
      cell: ({ row }) => {
        const prefix = { STUDENT: "STU", TEACHER: "TCH", ADMIN: "ADM" }[row.original.role] ?? "USR";
        const shortId = row.original.id.replace(/-/g, "").slice(0, 6).toUpperCase();
        const displayId = `${prefix}-${shortId}`;
        const prefixColors = {
          STU: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
          TCH: "bg-blue-500/10 text-blue-700 border-blue-500/20",
          ADM: "bg-red-500/10 text-red-700 border-red-500/20",
          USR: "bg-muted/50 text-muted-foreground border-border/30",
        }[prefix];
        return (
          <button
            onClick={() => {
              navigator.clipboard.writeText(displayId);
              toast.success("ID copied!");
            }}
            title={`Full UUID: ${row.original.id}`}
            className={`group flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[12px] font-bold transition-all hover:scale-105 active:scale-95 ${prefixColors}`}
          >
            {displayId}
            <svg className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        );
      },
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-primary/5 text-base font-bold text-primary shadow-inner">
            {row.original.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.original.avatar}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
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
          <div className="flex flex-col">
            <p className="text-[15px] font-bold text-foreground/90 tracking-tight">{row.original.name}</p>
            <p className="text-[13px] text-muted-foreground/80 font-medium">
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
        <div className="relative group/role w-fit">
          <select
            value={row.original.role}
            onChange={(e) =>
              updateRole.mutate({
                userId: row.original.id,
                role: e.target.value as "ADMIN" | "TEACHER" | "STUDENT",
              })
            }
            className={`appearance-none cursor-pointer rounded-lg pl-3 pr-8 py-1.5 text-[12px] font-bold tracking-wider ${roleColors[row.original.role] ?? ""} outline-none transition-all duration-200 hover:brightness-95`}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg className="h-3 w-3 opacity-50 group-hover/role:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const g = row.original.gender;
        if (!g) return <span className="text-[13px] text-muted-foreground/40 italic px-2">—</span>;
        const genderConfig = {
          MALE: { label: "Male", icon: "♂", class: "bg-blue-500/10 text-blue-600 border border-blue-500/20" },
          FEMALE: { label: "Female", icon: "♀", class: "bg-pink-500/10 text-pink-600 border border-pink-500/20" },
          OTHER: { label: "Other", icon: "⚥", class: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
        };
        const cfg = genderConfig[g];
        return (
          <span className={`rounded-lg px-3 py-1.5 text-[12px] font-bold tracking-wide ${cfg.class}`}>
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
    {
      accessorKey: "plainTextPassword",
      header: "Password",
      cell: function PasswordCell({ row }) {
        const [show, setShow] = useState(false);
        const pwd = row.original.plainTextPassword;
        if (!pwd) return <span className="text-sm text-muted-foreground/50 italic px-2">Hidden</span>;

        return (
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-muted/40 rounded-md px-3 py-1.5 overflow-hidden w-32 group/pwd cursor-text transition-colors hover:bg-muted/60">
              <span className={`text-[15px] font-mono tracking-widest ${show ? 'text-foreground/90' : 'text-muted-foreground'} select-all`}>
                {show ? pwd : "••••••••"}
              </span>
            </div>
            <button
              onClick={() => setShow(!show)}
              className="text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-all rounded p-1.5"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => {
        const dob = row.original.dateOfBirth;
        if (!dob) return <span className="text-[13px] text-muted-foreground/40 italic px-1">—</span>;
        const date = new Date(dob);
        const age = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        return (
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-foreground/80">
              {date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="text-[12px] text-muted-foreground/60">{age} yrs old</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isBanned = row.original.status === "banned";
        return (
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2 w-2 rounded-full ${isBanned ? 'bg-red-500' : 'bg-emerald-500'}`}>
              {!isBanned && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>}
            </span>
            <span
              className={`text-[13px] font-bold tracking-wider ${isBanned ? "text-red-500/80 cursor-default" : "text-emerald-500/80 cursor-default"}`}
            >
              {isBanned ? "BANNED" : "ACTIVE"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-muted-foreground/80">
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
            {/* Preview */}
            <button
              onClick={() => setPreviewUser(row.original)}
              title="Preview user"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-violet-500/70 transition-all hover:bg-violet-500/10 hover:text-violet-500 hover:scale-110 active:scale-95"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
            {/* Pin */}
            <button
              onClick={() => {
                setPinnedUsers(prev => {
                  const next = new Set(prev);
                  next.has(row.original.id) ? next.delete(row.original.id) : next.add(row.original.id);
                  return next;
                });
                toast.success(pinnedUsers.has(row.original.id) ? "Unpinned" : "Pinned!");
              }}
              title={pinnedUsers.has(row.original.id) ? "Unpin user" : "Pin user"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 ${
                pinnedUsers.has(row.original.id)
                  ? "text-orange-500 bg-orange-500/10"
                  : "text-muted-foreground/50 hover:bg-orange-500/10 hover:text-orange-500"
              }`}
            >
              <Pin className="h-5 w-5" />
            </button>
            {/* Export */}
            <button
              onClick={() => {
                const u = row.original;
                const csv = `ID,Name,Email,Role,Gender,Status\n${u.id},"${u.name}",${u.email},${u.role},${u.gender ?? ""},${u.status}`;
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${u.name.replace(/ /g, "_")}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              title="Export user as CSV"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-teal-500/70 transition-all hover:bg-teal-500/10 hover:text-teal-500 hover:scale-110 active:scale-95"
            >
              <Download className="h-5 w-5" />
            </button>
            {/* Edit */}
            <button
              onClick={() => setEditingUser(row.original)}
              title="Edit user"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-500/70 transition-all hover:bg-blue-500/10 hover:text-blue-500 hover:scale-110 active:scale-95"
            >
              <Pencil className="h-5 w-5" />
            </button>
            {/* Ban / Unban */}
            <button
              onClick={() =>
                isBanned
                  ? unbanUser.mutate({ userId: row.original.id })
                  : banUser.mutate({ userId: row.original.id })
              }
              title={isBanned ? "Unban user" : "Ban user"}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 ${
                isBanned
                  ? "text-emerald-500 hover:bg-emerald-500/10"
                  : "text-amber-500 hover:bg-amber-500/10"
              }`}
            >
              {isBanned ? (
                <Shield className="h-5 w-5" />
              ) : (
                <ShieldOff className="h-5 w-5" />
              )}
            </button>
            {/* Delete */}
            <button
              onClick={() => {
                if (confirm("Delete this user? This action cannot be undone.")) {
                  deleteUser.mutate({ userId: row.original.id });
                }
              }}
              title="Delete user"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500/70 transition-all hover:bg-red-500/10 hover:text-red-500 hover:scale-110 active:scale-95"
            >
              <Trash2 className="h-5 w-5" />
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
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  // Dynamically import to avoid SSR issues
                  const { default: jsPDF } = await import("jspdf");
                  const { default: autoTable } = await import("jspdf-autotable");

                  // Fetch ALL users in batches (router max is 500)
                  const batchSize = 500;
                  let offset = 0;
                  let allUsers: UserRow[] = [];
                  let hasMore = true;
                  while (hasMore) {
                    const result = await utils.admin.getUsers.fetch({ limit: batchSize, offset });
                    const batch = (result?.users ?? []) as UserRow[];
                    allUsers = allUsers.concat(batch);
                    offset += batchSize;
                    hasMore = batch.length === batchSize;
                  }

                  if (allUsers.length === 0) {
                    toast.error("No users to export");
                    return;
                  }

                  const doc = new jsPDF({ orientation: "landscape" });
                  doc.setFontSize(18);
                  doc.setTextColor(40, 40, 40);
                  doc.text("Green Academy — User Report", 14, 16);
                  doc.setFontSize(10);
                  doc.setTextColor(120, 120, 120);
                  doc.text(`Generated: ${new Date().toLocaleString()}  ·  Total Users: ${allUsers.length}`, 14, 24);

                  autoTable(doc, {
                    startY: 30,
                    head: [["ID", "Name", "Email", "Role", "Gender", "Date of Birth", "Status", "Joined"]],
                    body: allUsers.map(u => [
                      `${{ STUDENT: "STU", TEACHER: "TCH", ADMIN: "ADM" }[u.role] ?? "USR"}-${u.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
                      u.name,
                      u.email,
                      u.role,
                      u.gender ?? "—",
                      u.dateOfBirth
                        ? new Date(u.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                        : "—",
                      u.status,
                      formatDate(u.createdAt),
                    ]),
                    styles: { fontSize: 8.5, cellPadding: 3 },
                    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
                    alternateRowStyles: { fillColor: [245, 247, 255] },
                    columnStyles: { 2: { cellWidth: 55 } },
                  });

                  doc.save(`users_report_${new Date().toISOString().slice(0, 10)}.pdf`);
                  toast.success(`Exported ${allUsers.length} users to PDF`);
                } catch (e) {
                  toast.error("Failed to export PDF");
                  console.error(e);
                }
              }}
              className="group flex items-center justify-center gap-3 rounded-xl border-2 border-border/60 bg-card px-8 py-4 text-[18px] font-bold text-foreground/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-600 hover:shadow-md active:translate-y-0 active:scale-95"
            >
              <FileDown className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Export PDF
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="group flex items-center justify-center gap-3 rounded-xl border-2 border-border/60 bg-card px-8 py-4 text-[18px] font-bold text-foreground/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/50 hover:text-primary hover:shadow-md active:translate-y-0 active:scale-95"
            >
              <Upload className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Import CSV
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex items-center justify-center gap-3 rounded-xl bg-primary px-10 py-4 text-[18px] font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 active:scale-95"
            >
              <UserPlus className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              Create User
            </button>
          </div>
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative group/search">
          <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground transition-colors duration-300 group-focus-within/search:text-primary" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-11 w-72 lg:w-80 rounded-xl border-2 border-border/50 bg-card pl-10 pr-4 text-[14px] font-medium text-foreground outline-none shadow-sm transition-all duration-300 hover:border-border/80 focus:border-primary/50 focus:w-80 lg:focus:w-96 focus:ring-4 focus:ring-primary/10 focus:-translate-y-0.5"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-11 rounded-xl border-2 border-border/50 bg-card px-4 text-[14px] font-bold text-foreground/80 outline-none shadow-sm transition-all duration-300 hover:border-border/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:-translate-y-0.5 cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>
      </motion.div>

      {/* Pinned Users Section */}
      <AnimatePresence>
        {pinnedUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border-2 border-orange-400/30 bg-orange-500/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Pin className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600">Pinned Users</span>
                <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-600">{pinnedUsers.size}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(data?.users as UserRow[] ?? []).filter(u => pinnedUsers.has(u.id)).map(u => (
                  <div key={u.id} className="flex items-center gap-2 rounded-xl border border-orange-400/30 bg-card px-3 py-2 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary">
                      {u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold leading-tight">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">{u.role}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-1">
                      <button onClick={() => setEditingUser(u)} className="rounded p-1 text-blue-500/70 hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPinnedUsers(prev => { const n = new Set(prev); n.delete(u.id); return n; })}
                        className="rounded p-1 text-orange-500/70 hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                        title="Unpin"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Import CSV Modal */}
      <ImportCSVModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Edit User</h2>
                  <p className="text-xs text-muted-foreground">{editingUser.email}</p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  updateUser.mutate({
                    userId: editingUser.id,
                    name: fd.get("name") as string,
                    email: fd.get("email") as string,
                    gender: (fd.get("gender") as "MALE" | "FEMALE" | "OTHER") || null,
                    dateOfBirth: (fd.get("dateOfBirth") as string) || null,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium">Full Name</label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    required
                    defaultValue={editingUser.name}
                    className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="mb-1.5 block text-sm font-medium">Email</label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    required
                    defaultValue={editingUser.email}
                    className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="edit-gender" className="mb-1.5 block text-sm font-medium">Gender</label>
                  <select
                    id="edit-gender"
                    name="gender"
                    defaultValue={editingUser.gender ?? ""}
                    className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50"
                  >
                    <option value="">Not specified</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-dob" className="mb-1.5 block text-sm font-medium">Date of Birth</label>
                  <input
                    id="edit-dob"
                    name="dateOfBirth"
                    type="date"
                    defaultValue={editingUser.dateOfBirth ?? ""}
                    className="h-10 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 rounded-lg border border-border/50 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateUser.isPending}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {updateUser.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                    {updateUser.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview User Panel */}
      <AnimatePresence>
        {previewUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewUser(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative h-full w-full max-w-sm border-l border-border/50 bg-card shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 px-6 py-5">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">User Preview</span>
                <button onClick={() => setPreviewUser(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Avatar + Name */}
              <div className="flex flex-col items-center gap-3 border-b border-border/40 px-6 py-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary shadow-inner">
                  {previewUser.avatar
                    ? <img src={previewUser.avatar} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                    : previewUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{previewUser.name}</p>
                  <p className="text-sm text-muted-foreground">{previewUser.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-lg px-3 py-1 text-xs font-bold ${{
                    ADMIN: "bg-red-500/10 text-red-600",
                    TEACHER: "bg-blue-500/10 text-blue-600",
                    STUDENT: "bg-emerald-500/10 text-emerald-600",
                  }[previewUser.role]}`}>{previewUser.role}</span>
                  <span className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold ${previewUser.status === "banned" ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${previewUser.status === "banned" ? "bg-red-500" : "bg-emerald-500"}`} />
                    {previewUser.status === "banned" ? "BANNED" : "ACTIVE"}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
                {[
                  { label: "User ID", value: `${{ STUDENT: "STU", TEACHER: "TCH", ADMIN: "ADM" }[previewUser.role]}-${previewUser.id.replace(/-/g, "").slice(0, 6).toUpperCase()}` },
                  { label: "Gender", value: previewUser.gender ?? "Not specified" },
                  { label: "Date of Birth", value: previewUser.dateOfBirth
                      ? (() => {
                          const d = new Date(previewUser.dateOfBirth);
                          const age = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
                          return `${d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} (${age} yrs old)`;
                        })()
                      : "Not specified" },
                  { label: "Joined", value: formatDate(previewUser.createdAt) },
                  { label: "Password", value: previewUser.plainTextPassword ?? "Hidden" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Footer actions */}
              <div className="border-t border-border/40 px-6 py-4 flex gap-3">
                <button
                  onClick={() => { setPreviewUser(null); setEditingUser(previewUser); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Pencil className="h-4 w-4" /> Edit User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
