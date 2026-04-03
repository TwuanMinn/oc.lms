"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "@/lib/auth-client";
import { sidebarNavItem, staggerContainer, springBounce, collapseVariants } from "@/lib/motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
  { label: "Bookmarks", href: "/dashboard/student/bookmarks", icon: Bookmark },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const navItems =
    role === "ADMIN"
      ? adminNav
      : role === "TEACHER"
        ? teacherNav
        : studentNav;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="hidden shrink-0 border-r border-border/50 bg-background/50 backdrop-blur-xl lg:flex lg:flex-col"
    >
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <div className="mb-2 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.p
                key="label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {role === "ADMIN" ? "Admin" : role === "TEACHER" ? "Teacher" : "Student"}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </motion.button>
        </div>

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
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-linear-to-r from-primary/15 to-transparent"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-primary"
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
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Section */}
        <div className="flex-1" />
        <div className="mt-auto border-t border-border/50 pt-4 flex flex-col gap-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <motion.span whileHover={{ rotate: 90 }} transition={springBounce}>
              <Settings className="h-4 w-4" />
            </motion.span>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <button
            onClick={handleLogout}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-rose-500 hover:bg-rose-500/10",
              collapsed && "justify-center px-0"
            )}
          >
            <motion.span whileHover={{ scale: 1.1, x: 2 }} transition={springBounce}>
              <LogOut className="h-4 w-4" />
            </motion.span>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}
