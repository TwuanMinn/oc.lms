"use client";

import dynamic from "next/dynamic";

const ScheduleCalendar = dynamic(
  () => import("@/components/calendar/ScheduleCalendar"),
  { ssr: false }
);

export default function TeacherCalendarPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 lg:p-8">
      <ScheduleCalendar role="TEACHER" />
    </div>
  );
}
