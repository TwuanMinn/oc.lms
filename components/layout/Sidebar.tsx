"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  Bookmark,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/student", icon: BookOpen },
  { label: "Bookmarks", href: "/dashboard/student", icon: Bookmark },
];

const teacherNav: NavItem[] = [
  { label: "My Courses", href: "/dashboard/teacher/courses", icon: BookOpen },
];

const adminNav: NavItem[] = [
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Courses", href: "/dashboard/admin/courses", icon: GraduationCap },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const navItems =
    role === "ADMIN"
      ? adminNav
      : role === "TEACHER"
        ? teacherNav
        : studentNav;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/40 bg-card lg:block">
      <nav className="flex flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {role === "ADMIN" ? "Admin" : role === "TEACHER" ? "Teacher" : "Student"}
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
