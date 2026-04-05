"use client";

import { useSession } from "@/lib/auth-client";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  dashboardPath: string;
}

const roleDashboardMap: Record<UserRole, string> = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/teacher/courses",
  STUDENT: "/dashboard/student",
};

export function useAuth(): AuthState {
  const { data: session, isPending } = useSession();

  const rawUser = session?.user as (Record<string, unknown> & { id: string; name: string; email: string; image?: string | null }) | undefined;
  const role = (rawUser?.role as UserRole) ?? "STUDENT";

  const user: AuthUser | null = rawUser
    ? {
        id: rawUser.id,
        name: rawUser.name,
        email: rawUser.email,
        image: rawUser.image,
        role,
      }
    : null;

  return {
    user,
    role,
    isAuthenticated: !!user,
    isLoading: isPending,
    dashboardPath: roleDashboardMap[role],
  };
}
