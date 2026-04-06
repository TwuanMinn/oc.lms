import React from "react";
import CalendarComponent from "@/components/calendar/CalendarComponent";

export const metadata = {
  title: "My Calendar | Green Academy",
  description: "View your personal learning schedule and upcoming events.",
};

export default function StudentCalendarPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 lg:p-8">
      <CalendarComponent role="STUDENT" />
    </div>
  );
}
