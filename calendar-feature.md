# Dashboard Calendar Feature

## Overview
Added a full-screen, drag-and-drop calendar component to the LMS dashboard, resolving the 404 error on the `/dashboard/student/calendar` and `/dashboard/teacher/calendar` routes.

## Features Built
1. **Interactive Calendar UI**: Built using `react-big-calendar`, featuring Month, Week, and Day views.
2. **Drag and Drop Engine**: Integrated `withDragAndDrop` to allow teachers to visually reschedule events by dragging them across days or resizing their duration.
3. **Role-Based Access**:
   - **Teachers**: Full read-write permission. Can drag events, resize durations, and click empty slots to create new events.
   - **Students**: Read-only view. Cannot modify schedules.
4. **Mock Data Integration**: Pre-filled the calendar with beautiful, realistic LMS data (Live Classes, Assignments, Q&A Sessions, Milestones) to immediately resolve the 404 issue with a functional UI.
5. **Modern Aesthetics**: Customized `react-big-calendar` with Tailwind CSS, Lucide Icons, and Framer Motion animations to ensure the interface feels exceptionally premium and responsive.

## Files Added
- `components/calendar/CalendarComponent.tsx`: Core interactive tracking component.
- `app/dashboard/student/calendar/page.tsx`: Route for students.
- `app/dashboard/teacher/calendar/page.tsx`: Route for teachers.

## Next Steps
In the future, we will link `events` directly to the `lessons` or new scheduling tables inside the Drizzle Postgres schema to reflect real-time production data!
