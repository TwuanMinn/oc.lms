"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { sidebarNavItem, staggerContainer, springBounce } from "@/lib/motion";
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
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {role === "ADMIN" ? "Admin" : role === "TEACHER" ? "Teacher" : "Student"}
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-1"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href + item.label} variants={sidebarNavItem}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <motion.span
                    whileHover={{ scale: 1.15, rotate: -6 }}
                    transition={springBounce}
                    className="relative z-10"
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </nav>
    </aside>
  );
}
