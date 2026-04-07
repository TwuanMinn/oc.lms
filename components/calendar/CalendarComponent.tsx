"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Event as CalendarEvent } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay, addHours, startOfHour } from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { Clock, Video, FileText, User, Sparkles, ChevronLeft, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DnDCalendar = withDragAndDrop<CalendarEvent & { type?: string; color?: string; description?: string }>(Calendar as React.ComponentType<any>);

type CustomEvent = CalendarEvent & {
  id?: string | number;
  type: "LIVE_CLASS" | "ASSIGNMENT" | "MILESTONE" | "QA_SESSION" | string;
  colorTheme: "primary" | "success" | "warning" | "destructive" | "accent";
  description?: string;
  teacher?: string;
};

const generateMockEvents = (): CustomEvent[] => {
  const now = new Date();
  const today = startOfHour(now);

  return [
    {
      id: 1,
      title: "React Native Live Session",
      start: addHours(today, 2),
      end: addHours(today, 5),
      type: "LIVE_CLASS",
      colorTheme: "primary",
      description: "Advanced Reanimated architectural scaling & 60fps locking.",
      teacher: "Sarah Jenkins",
    },
    {
      id: 2,
      title: "UI Design Assignment Due",
      start: addHours(today, 48),
      end: addHours(today, 50),
      type: "ASSIGNMENT",
      colorTheme: "destructive",
      description: "Deliver final Figma prototype.",
    },
    {
      id: 3,
      title: "Weekly Q&A Office Hours",
      start: addHours(today, -20),
      end: addHours(today, -18),
      type: "QA_SESSION",
      colorTheme: "success",
      description: "Open office hours for troubleshooting.",
    },
    {
      id: 4,
      title: "Course Kickoff Milestone",
      start: addHours(today, -72),
      end: addHours(today, -70),
      type: "MILESTONE",
      colorTheme: "warning",
      description: "Initialization of cohort learning sequence.",
    },
  ];
};

interface CalendarComponentProps {
  role?: "STUDENT" | "TEACHER" | "ADMIN";
}

export default function CalendarComponent({ role = "STUDENT" }: CalendarComponentProps) {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEvents(generateMockEvents());
    setMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moveEvent = useCallback(({ event, start, end, isAllDay: droppedOnAllDaySlot }: any) => {
    if (role === "STUDENT") {
      toast.error("Read-only access. Only teachers can reschedule.");
      return;
    }
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end, allDay: droppedOnAllDaySlot } as CustomEvent];
    });
    toast.success(`"${event.title}" rescheduled!`, {
      description: `Moved to ${format(new Date(start), "MMM do, h:mm a")}`
    });
  }, [role]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resizeEvent = useCallback(({ event, start, end }: any) => {
    if (role === "STUDENT") {
      toast.error("Read-only access. Only teachers can change durations.");
      return;
    }
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end } as CustomEvent];
    });
    toast.success(`"${event.title}" duration updated`);
  }, [role]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newEvent = useCallback((slotInfo: any) => {
    if (role === "STUDENT") {
      toast.info("Select a date to view activity summary.");
      return;
    }
    const title = window.prompt("New Event Title:");
    if (title) {
      setEvents((prev) => [...prev, {
        id: Math.random(),
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        type: "LIVE_CLASS",
        colorTheme: "primary",
      }]);
      toast.success("Event created successfully");
    }
  }, [role]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomEventUI = ({ event }: any) => {
    const isPast = event.start && new Date(event.start) < new Date();
    
    let Icon = Clock;
    if (event.type === "LIVE_CLASS") Icon = Video;
    if (event.type === "ASSIGNMENT") Icon = FileText;
    if (event.type === "MILESTONE") Icon = Sparkles;
    
    // Mapping functional categories to current theme colors with alpha transparency
    const themeStyles: Record<string, string> = {
      primary: "bg-primary/10 text-primary border-primary/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      destructive: "bg-destructive/10 text-destructive border-destructive/20",
      accent: "bg-accent/50 text-accent-foreground border-accent",
    };

    const baseClass = themeStyles[event.colorTheme] || themeStyles.primary;

    return (
      <div className={cn(
        "flex flex-col h-full w-full p-1.5 rounded-lg border text-xs overflow-hidden transition-all duration-200",
        baseClass,
        isPast ? "opacity-60" : "shadow-sm hover:shadow-md hover:-translate-y-0.5"
      )}>
        <div className="flex items-center gap-1.5 font-semibold mb-0.5 truncate">
          <Icon className="w-3 h-3 shrink-0" />
          <span className="truncate">{event.title}</span>
        </div>
        {event.teacher && (
          <div className="flex items-center gap-1 opacity-80 text-[10px] mt-auto">
            <User className="w-2.5 h-2.5" />
            <span className="truncate">{event.teacher}</span>
          </div>
        )}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-100px)] min-h-[600px] w-full flex items-center justify-center bg-card rounded-3xl animate-pulse">
        <CalendarDays className="w-12 h-12 text-muted-foreground animate-bounce" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="h-[calc(100vh-100px)] min-h-[600px] w-full bg-card rounded-3xl border border-border shadow-xl p-4 lg:p-8 flex flex-col font-sans"
    >
      <div className="flex items-start justify-between mb-6 border-b border-border pb-4">
        <div>
          <Link 
            href={role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-primary" />
            {role === "TEACHER" ? "Schedule Manager" : "My Learning Schedule"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            {role === "TEACHER" 
              ? "Drag and drop to reschedule classes. Click empty slots to add new sessions." 
              : "Keep track of your classes, live sessions, and due assignments."}
          </p>
        </div>
        
        {/* Decorative elements / Legend */}
        <div className="hidden md:flex gap-4 text-xs font-medium bg-muted/50 p-3 rounded-2xl border border-border">
           <div className="flex items-center gap-2 text-primary"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> Live Class</div>
           <div className="flex items-center gap-2 text-destructive"><div className="w-2.5 h-2.5 rounded-full bg-destructive" /> Assignment</div>
           <div className="flex items-center gap-2 text-success"><div className="w-2.5 h-2.5 rounded-full bg-success" /> Q&A Session</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative soft-calendar-container">
        <style dangerouslySetInnerHTML={{ __html: `
          .soft-calendar-container .rbc-calendar {
            font-family: var(--font-sans);
          }
          .soft-calendar-container .rbc-header {
            padding: 12px;
            font-weight: 600;
            color: var(--color-muted-foreground);
            border-bottom: 1px solid var(--color-border);
          }
          .soft-calendar-container .rbc-today {
            background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
          }
          .soft-calendar-container .rbc-event, 
          .soft-calendar-container .rbc-background-event {
            background-color: transparent !important;
            padding: 0 !important;
            border: none !important;
          }
          .soft-calendar-container .rbc-month-view,
          .soft-calendar-container .rbc-time-view,
          .soft-calendar-container .rbc-month-row,
          .soft-calendar-container .rbc-day-bg,
          .soft-calendar-container .rbc-header,
          .soft-calendar-container .rbc-agenda-view table.rbc-agenda-table {
            border-color: var(--color-border);
          }
          .soft-calendar-container .rbc-toolbar {
            padding-bottom: 16px;
          }
          .soft-calendar-container .rbc-toolbar button {
            color: var(--color-muted-foreground);
            border: 1px solid var(--color-border);
            border-radius: var(--radius);
            padding: 6px 12px;
            transition: all 0.2s;
            font-weight: 500;
            font-size: 14px;
          }
          .soft-calendar-container .rbc-toolbar button:hover {
            color: var(--color-foreground);
            background: var(--color-muted);
          }
          .soft-calendar-container .rbc-toolbar button.rbc-active {
            background: var(--color-primary);
            color: var(--color-primary-foreground);
            border-color: var(--color-primary);
          }
        `}} />
        <DnDCalendar
          localizer={localizer}
          events={events}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectSlot={newEvent}
          startAccessor="start"
          endAccessor="end"
          resizable
          selectable
          components={{ event: CustomEventUI }}
          defaultView="month"
          views={["month", "week", "day"]}
        />
      </div>
    </motion.div>
  );
}
