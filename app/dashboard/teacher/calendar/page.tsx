import React from "react";
import CalendarComponent from "@/components/calendar/CalendarComponent";

export const metadata = {
  title: "Teacher Calendar | Green Academy",
  description: "Manage your teaching schedule and live classes.",
};

export default function TeacherCalendarPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 lg:p-8">
      <CalendarComponent role="TEACHER" />
    </div>
  );
}
