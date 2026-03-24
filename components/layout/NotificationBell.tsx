"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );
  const { data: notifications } = trpc.notification.getUnread.useQuery(
    undefined,
    { enabled: isOpen }
  );
  const markAllRead = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.getUnreadCount.invalidate();
      utils.notification.getUnread.invalidate();
    },
  });

  const utils = trpc.useUtils();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayCount =
    typeof unreadCount === "number" ? (unreadCount > 9 ? "9+" : String(unreadCount)) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {displayCount && Number(unreadCount) > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {displayCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border p-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {Number(unreadCount) > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs font-medium text-primary hover:text-primary/80"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.id} className="border-b border-border/50 p-3 last:border-b-0">
                  {n.link ? (
                    <Link href={n.link} onClick={() => setIsOpen(false)}>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatDate(n.createdAt)}
                      </p>
                    </Link>
                  ) : (
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
