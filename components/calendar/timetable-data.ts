// Timetable constants, types, and helpers (no mock data)

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type ViewRole = "admin" | "teacher" | "student";
export type AdminTab = "timetable" | "teachers" | "students";

export interface Period {
  id: number;
  label: string;
  start: string;
  end: string;
}

export const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const DAY_SHORT: Record<Day, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};

export const PERIODS: Period[] = [
  { id: 8, label: "Period 8", start: "08:00", end: "12:30" },
  { id: 1, label: "Period 1", start: "12:00", end: "13:15" },
  { id: 2, label: "Period 2", start: "13:20", end: "14:35" },
  { id: 3, label: "Period 3", start: "14:40", end: "15:55" },
  { id: 4, label: "Period 4", start: "16:00", end: "17:15" },
  { id: 5, label: "Period 5", start: "17:20", end: "18:35" },
  { id: 6, label: "Period 6", start: "18:40", end: "19:55" },
  { id: 7, label: "Period 7", start: "20:00", end: "21:30" },
];

// ── Color per course ──
const COLORS = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444",
  "#06B6D4", "#EC4899", "#14B8A6", "#F97316", "#6366F1",
];

export function getCourseColor(courseId: string): string {
  let h = 0;
  for (let i = 0; i < courseId.length; i++) {
    h = ((h << 5) - h) + courseId.charCodeAt(i);
    h |= 0;
  }
  return COLORS[Math.abs(h) % COLORS.length];
}

// ── Map a Date to a Day ──
export function getEventDay(d: Date): Day | null {
  const map: Record<number, Day> = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 0: "Sunday" };
  return map[d.getDay()] || null;
}

// ── Map a Date to a Period ID ──
export function getEventPeriodId(d: Date): number | null {
  const mins = d.getHours() * 60 + d.getMinutes();
  for (const p of PERIODS) {
    const [sh, sm] = p.start.split(":").map(Number);
    const [eh, em] = p.end.split(":").map(Number);
    if (mins >= sh * 60 + sm && mins < eh * 60 + em) return p.id;
  }
  // If exact end time
  for (const p of PERIODS) {
    const [sh, sm] = p.start.split(":").map(Number);
    const [eh, em] = p.end.split(":").map(Number);
    if (mins >= sh * 60 + sm - 5 && mins <= eh * 60 + em) return p.id;
  }
  return null;
}

// ── Build start/end Date for a Day + Period ──
export function buildEventDates(day: Day, periodId: number): { start: Date; end: Date } {
  const dayIdx: Record<Day, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 0 };
  const period = PERIODS.find(p => p.id === periodId)!;
  const [sh, sm] = period.start.split(":").map(Number);
  const [eh, em] = period.end.split(":").map(Number);

  const today = new Date();
  const todayDay = today.getDay();
  const target = dayIdx[day];
  let diff = target - todayDay;
  if (diff <= 0) diff += 7;

  const date = new Date(today);
  date.setDate(today.getDate() + diff);

  const start = new Date(date);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(date);
  end.setHours(eh, em, 0, 0);

  return { start, end };
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}
