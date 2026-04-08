"use client";

import React, { useState, useMemo } from "react";
import {
  Users, GraduationCap, Plus, Pencil, Trash2, X,
  MapPin, School, Loader2, Clock, BookOpen, Calendar, FlaskConical, Presentation, Video, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  type Day, type ViewRole, type AdminTab,
  DAYS, DAY_SHORT, PERIODS,
  getCourseColor, getEventDay, getEventPeriodId,
  buildEventDates, getInitials,
} from "./timetable-data";

// ── Mapped cell ──
interface Cell {
  eventId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  room: string;
  group: string;
  classType: string;
  day: Day;
  periodId: number;
  color: string;
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════

export default function ScheduleCalendar({ role }: { role?: string }) {
  const [viewRole, setViewRole] = useState<ViewRole>("admin");
  const [adminTab, setAdminTab] = useState<AdminTab>("timetable");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ courseId: "", day: "Monday" as Day, periodId: 1, room: "", classType: "LECTURE" as "LECTURE" | "LAB" | "MAKEUP_CLASS" | "ONLINE_SESSION" });

  const utils = trpc.useUtils();
  const coursesQ = trpc.schedule.allCourses.useQuery();
  const eventsQ = trpc.schedule.getMySchedules.useQuery();
  const teachersQ = trpc.admin.getUsers.useQuery({ limit: 500, role: "TEACHER" });
  const studentsQ = trpc.admin.getUsers.useQuery({ limit: 500, role: "STUDENT" });

  const createM = trpc.schedule.create.useMutation({
    onSuccess: () => { toast.success("Class scheduled"); utils.schedule.getMySchedules.invalidate(); setFormMode(null); },
    onError: (e) => toast.error(e.message),
  });
  const updateM = trpc.schedule.update.useMutation({
    onSuccess: () => { toast.success("Updated"); utils.schedule.getMySchedules.invalidate(); setFormMode(null); },
    onError: (e) => toast.error(e.message),
  });
  const deleteM = trpc.schedule.delete.useMutation({
    onSuccess: () => { toast.success("Removed"); utils.schedule.getMySchedules.invalidate(); setFormMode(null); },
    onError: (e) => toast.error(e.message),
  });

  // Map events → cells
  const cells = useMemo<Cell[]>(() => {
    if (!eventsQ.data) return [];
    return eventsQ.data.map(ev => {
      const d = new Date(ev.startTime);
      const day = getEventDay(d);
      const periodId = getEventPeriodId(d);
      if (!day || !periodId) return null;
      const course = coursesQ.data?.find(c => c.id === ev.courseId);
      return {
        eventId: ev.id, courseId: ev.courseId,
        courseCode: course?.courseCode || "",
        courseTitle: course?.title || (ev as any).courseTitle || ev.title,
        teacherName: course?.teacherName || "",
        room: (ev as any).room || "",
        group: (course as any)?.group || "",
        classType: (ev as any).classType || "LECTURE", day, periodId,
        color: getCourseColor(ev.courseId),
      };
    }).filter(Boolean) as Cell[];
  }, [eventsQ.data, coursesQ.data]);

  const stats = {
    teachers: teachersQ.data?.total ?? 0,
    students: studentsQ.data?.total ?? 0,
    courses: coursesQ.data?.length ?? 0,
  };

  const openAdd = (day?: Day, periodId?: number) => {
    setFormMode("add"); setEditingEventId(null);
    setFormData({ courseId: selectedCourseId || coursesQ.data?.[0]?.id || "", day: day || "Monday", periodId: periodId || 1, room: "", classType: "LECTURE" });
  };
  const openEdit = (cell: Cell) => {
    setFormMode("edit"); setEditingEventId(cell.eventId);
    setFormData({ courseId: cell.courseId, day: cell.day, periodId: cell.periodId, room: cell.room, classType: (cell.classType as "LECTURE" | "LAB" | "MAKEUP_CLASS" | "ONLINE_SESSION") || "LECTURE" });
  };
  const saveSlot = () => {
    const course = coursesQ.data?.find(c => c.id === formData.courseId);
    if (!course) { toast.error("Select a course"); return; }
    const { start, end } = buildEventDates(formData.day, formData.periodId);
    if (formMode === "add") {
      createM.mutate({ courseId: formData.courseId, title: course.title, room: formData.room || undefined, classType: formData.classType, eventType: "LIVE_CLASS", startTime: start.toISOString(), endTime: end.toISOString() });
    } else if (editingEventId) {
      updateM.mutate({ eventId: editingEventId, room: formData.room || undefined, classType: formData.classType, startTime: start.toISOString(), endTime: end.toISOString() });
    }
  };
  const deleteSlot = () => { if (editingEventId) deleteM.mutate({ eventId: editingEventId }); };

  const filteredCells = useMemo(() => {
    if (viewRole === "teacher" && selectedTeacherId) {
      const teacher = ((teachersQ.data as any)?.users || []).find((u: any) => u.id === selectedTeacherId);
      if (!teacher) return [];
      const teacherCourseIds = new Set(coursesQ.data?.filter(c => c.teacherName === teacher.name).map(c => c.id) || []);
      return cells.filter(c => teacherCourseIds.has(c.courseId));
    }
    if (selectedCourseId) return cells.filter(c => c.courseId === selectedCourseId);
    return cells;
  }, [cells, viewRole, selectedTeacherId, selectedCourseId, coursesQ.data, teachersQ.data]);

  const isLoading = coursesQ.isLoading || eventsQ.isLoading;

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center animate-pulse">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading timetable…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tt-root">
      {/* ── Header ── */}
      <div className="tt-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">School Timetable</h1>
            <p className="text-xs text-slate-400">Manage your class schedule</p>
          </div>
        </div>
        <div className="tt-role-switcher">
          {(["admin", "teacher", "student"] as ViewRole[]).map(r => (
            <button key={r} onClick={() => setViewRole(r)}
              className={cn("tt-role-btn", viewRole === r && "tt-role-active")}
            >
              {r === "admin" && <School className="w-3.5 h-3.5" />}
              {r === "teacher" && <BookOpen className="w-3.5 h-3.5" />}
              {r === "student" && <GraduationCap className="w-3.5 h-3.5" />}
              <span className="capitalize">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tt-body">
        {/* ═══ ADMIN ═══ */}
        {viewRole === "admin" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={<Users className="w-5 h-5" />} label="Teachers" value={stats.teachers} color="#3B82F6" gradient="from-blue-500 to-blue-600" />
              <StatCard icon={<GraduationCap className="w-5 h-5" />} label="Students" value={stats.students} color="#10B981" gradient="from-emerald-500 to-emerald-600" />
              <StatCard icon={<BookOpen className="w-5 h-5" />} label="Courses" value={stats.courses} color="#F97316" gradient="from-orange-400 to-orange-500" />
            </div>

            {/* Tabs */}
            <div className="tt-tabs">
              {(["timetable", "teachers", "students"] as AdminTab[]).map(tab => (
                <button key={tab} onClick={() => setAdminTab(tab)}
                  className={cn("tt-tab", adminTab === tab && "tt-tab-active")}
                >
                  {tab === "timetable" && <Calendar className="w-3.5 h-3.5" />}
                  {tab === "teachers" && <Users className="w-3.5 h-3.5" />}
                  {tab === "students" && <GraduationCap className="w-3.5 h-3.5" />}
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </div>

            {adminTab === "timetable" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Filter:</span>
                    <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="tt-select">
                      <option value="">All Courses</option>
                      {coursesQ.data?.map(c => <option key={c.id} value={c.id}>{c.courseCode ? `${c.courseCode} — ${c.title}` : c.title}</option>)}
                    </select>
                  </div>
                  <button onClick={() => openAdd()} className="tt-btn-primary">
                    <Plus className="w-4 h-4" /> Add Slot
                  </button>
                </div>
                <TimetableGrid cells={filteredCells} onCellClick={openEdit} onEmptyClick={(d, p) => openAdd(d, p)} interactive />
                {formMode && (
                  <SlotForm formData={formData} setFormData={setFormData} courses={coursesQ.data || []}
                    mode={formMode} onSave={saveSlot} onDelete={deleteSlot} onCancel={() => setFormMode(null)}
                    loading={createM.isPending || updateM.isPending || deleteM.isPending} />
                )}
              </div>
            )}
            {adminTab === "teachers" && <TeachersTab teachers={(teachersQ.data as any)?.users || []} courses={coursesQ.data || []} />}
            {adminTab === "students" && <StudentsTab students={(studentsQ.data as any)?.users || []} />}
          </>
        )}

        {/* ═══ TEACHER ═══ */}
        {viewRole === "teacher" && (
          <div className="space-y-5">
            <div className="tt-card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><BookOpen className="w-4 h-4 text-blue-500" /></div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium text-slate-500">View schedule for:</span>
                <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="tt-select flex-1 max-w-xs">
                  <option value="">Select a teacher</option>
                  {((teachersQ.data as any)?.users || []).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <TimetableGrid cells={filteredCells} showClass />
          </div>
        )}

        {/* ═══ STUDENT ═══ */}
        {viewRole === "student" && (
          <div className="space-y-5">
            <div className="tt-card p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-emerald-500" /></div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium text-slate-500">Timetable for:</span>
                <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="tt-select flex-1 max-w-xs">
                  <option value="">All Courses</option>
                  {coursesQ.data?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
            </div>
            <TimetableGrid cells={filteredCells} showTeacher />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    </div>
  );
}


// ═══════════════════════════════════════
// TIMETABLE GRID
// ═══════════════════════════════════════

function TimetableGrid({ cells, onCellClick, onEmptyClick, interactive, showClass, showTeacher }: {
  cells: Cell[];
  onCellClick?: (c: Cell) => void;
  onEmptyClick?: (d: Day, p: number) => void;
  interactive?: boolean;
  showClass?: boolean;
  showTeacher?: boolean;
}) {
  const lookup = useMemo(() => {
    const m = new Map<string, Cell>();
    for (const c of cells) m.set(`${c.day}-${c.periodId}`, c);
    return m;
  }, [cells]);

  return (
    <div className="tt-card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="grid min-w-[720px]" style={{ gridTemplateColumns: "100px repeat(7, 1fr)" }}>
          {/* Header */}
          <div className="grid-corner" />
          {DAYS.map(day => (
            <div key={day} className="grid-day-header">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{DAY_SHORT[day]}</span>
            </div>
          ))}

          {/* Rows */}
          {PERIODS.map((period, pi) => (
            <React.Fragment key={period.id}>
              <div className={cn("grid-time", pi === 0 && "border-t-0")}>
                <span className="text-xs font-semibold text-slate-600">{period.start}</span>
                <span className="text-[10px] text-slate-300">{period.end}</span>
              </div>
              {DAYS.map(day => {
                const cell = lookup.get(`${day}-${period.id}`);
                if (!cell) {
                  return (
                    <div key={day}
                      className={cn("grid-cell-empty", pi === 0 && "border-t-0", interactive && "cursor-pointer group")}
                      onClick={() => interactive && onEmptyClick?.(day, period.id)}
                    >
                      {interactive && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center h-full">
                          <Plus className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={day}
                    className={cn("grid-cell-filled", pi === 0 && "border-t-0", interactive && "cursor-pointer")}
                    onClick={() => interactive && onCellClick?.(cell)}
                  >
                    <div className="slot-block" style={{ '--slot-color': cell.color } as React.CSSProperties}>
                      <div className="slot-accent" style={{ backgroundColor: cell.color }} />
                      <div className="slot-content">
                        {cell.classType && (
                          <span className={cn("slot-type-badge",
                            cell.classType === "LAB" ? "slot-type-lab" :
                            cell.classType === "MAKEUP_CLASS" ? "slot-type-makeup" :
                            cell.classType === "ONLINE_SESSION" ? "slot-type-online" :
                            "slot-type-lecture"
                          )}>
                            {cell.classType === "LAB" && <FlaskConical className="w-2.5 h-2.5" />}
                            {cell.classType === "LECTURE" && <Presentation className="w-2.5 h-2.5" />}
                            {cell.classType === "MAKEUP_CLASS" && <RefreshCw className="w-2.5 h-2.5" />}
                            {cell.classType === "ONLINE_SESSION" && <Video className="w-2.5 h-2.5" />}
                            {cell.classType === "MAKEUP_CLASS" ? "Make-up" : cell.classType === "ONLINE_SESSION" ? "Online" : cell.classType}
                          </span>
                        )}
                        {cell.courseCode && (
                          <span className="slot-code" style={{ color: cell.color, background: `color-mix(in srgb, ${cell.color} 12%, transparent)` }}>{cell.courseCode}</span>
                        )}
                        <span className="slot-title" style={{ color: cell.color }}>{cell.courseTitle}</span>
                        {cell.group && (
                          <span className="slot-group">
                            <Users className="w-2.5 h-2.5" />Group {cell.group}
                          </span>
                        )}
                        {(showTeacher || (!showClass)) && cell.teacherName && (
                          <span className="slot-meta">{cell.teacherName}</span>
                        )}
                        {showClass && <span className="slot-meta">Course</span>}
                        {cell.room && (
                          <span className="slot-room">
                            <MapPin className="w-2.5 h-2.5" />{cell.room}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════
// SLOT FORM
// ═══════════════════════════════════════

function SlotForm({ formData, setFormData, courses, mode, onSave, onDelete, onCancel, loading }: {
  formData: { courseId: string; day: Day; periodId: number; room: string; classType: "LECTURE" | "LAB" | "MAKEUP_CLASS" | "ONLINE_SESSION" };
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  courses: any[];
  mode: "add" | "edit";
  onSave: () => void; onDelete: () => void; onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="tt-card p-5 space-y-4 border-blue-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          {mode === "add" ? <Plus className="w-4 h-4 text-blue-500" /> : <Pencil className="w-4 h-4 text-blue-500" />}
        </div>
        <h4 className="text-sm font-bold text-slate-700">{mode === "add" ? "Schedule New Class" : "Edit Class"}</h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <label className="tt-label">Course</label>
          <select value={formData.courseId} onChange={e => setFormData(p => ({ ...p, courseId: e.target.value }))} className="tt-select w-full">
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="tt-label">Day</label>
          <select value={formData.day} onChange={e => setFormData(p => ({ ...p, day: e.target.value as Day }))} className="tt-select w-full">
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="tt-label">Period</label>
          <select value={formData.periodId} onChange={e => setFormData(p => ({ ...p, periodId: Number(e.target.value) }))} className="tt-select w-full">
            {PERIODS.map(p => <option key={p.id} value={p.id}>{p.label} ({p.start})</option>)}
          </select>
        </div>
        <div>
          <label className="tt-label">Room</label>
          <input type="text" value={formData.room} onChange={e => setFormData(p => ({ ...p, room: e.target.value }))} placeholder="e.g. Room 101" className="tt-input" />
        </div>
        <div>
          <label className="tt-label">Type</label>
          <select value={formData.classType} onChange={e => setFormData(p => ({ ...p, classType: e.target.value as "LECTURE" | "LAB" | "MAKEUP_CLASS" | "ONLINE_SESSION" }))} className="tt-select w-full">
            <option value="LECTURE">Lecture</option>
            <option value="LAB">Lab</option>
            <option value="MAKEUP_CLASS">Make-up Class</option>
            <option value="ONLINE_SESSION">Online Session</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={loading} className="tt-btn-primary">{loading ? "Saving…" : "Save"}</button>
        {mode === "edit" && (
          <button onClick={onDelete} disabled={loading} className="tt-btn-danger"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
        )}
        <button onClick={onCancel} className="tt-btn-ghost">Cancel</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════
// TEACHERS TAB
// ═══════════════════════════════════════

function TeachersTab({ teachers, courses }: { teachers: any[]; courses: any[] }) {
  if (!teachers.length) return <EmptyState icon={<Users className="w-6 h-6" />} text="No teachers found" />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((t: any) => {
        const tc = courses.filter((c: any) => c.teacherName === t.name);
        return (
          <div key={t.id} className="tt-card p-4 flex flex-col gap-3 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-blue-500/20">
                {getInitials(t.name || "?")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700 truncate">{t.name}</p>
                <p className="text-xs text-slate-400 truncate">{t.email}</p>
              </div>
            </div>
            {tc.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tc.slice(0, 4).map((c: any) => (
                  <span key={c.id} className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                    {c.courseCode ? `${c.courseCode} — ${c.title}` : c.title}
                  </span>
                ))}
                {tc.length > 4 && <span className="px-2 py-1 text-[10px] font-semibold text-slate-400">+{tc.length - 4}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ═══════════════════════════════════════
// STUDENTS TAB
// ═══════════════════════════════════════

function StudentsTab({ students }: { students: any[] }) {
  if (!students.length) return <EmptyState icon={<GraduationCap className="w-6 h-6" />} text="No students found" />;
  return (
    <div className="tt-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/80">
            <th className="text-left py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
            <th className="text-left py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
            <th className="text-left py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s: any) => (
            <tr key={s.id} className="border-t border-slate-50 hover:bg-blue-50/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {getInitials(s.name || "?")}
                  </div>
                  <span className="font-semibold text-slate-700">{s.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-slate-400 text-xs">{s.email}</td>
              <td className="py-3 px-4">
                <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-lg", s.status === "ACTIVE" || !s.status ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400")}>
                  {(s.status || "active").toLowerCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ═══════════════════════════════════════
// SHARED
// ═══════════════════════════════════════

function StatCard({ icon, label, value, color, gradient }: { icon: React.ReactNode; label: string; value: number; color: string; gradient: string }) {
  return (
    <div className="tt-card p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200">
      <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg", gradient)} style={{ boxShadow: `0 8px 16px -4px ${color}30` }}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
        <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="tt-card p-12 flex flex-col items-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">{icon}</div>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}


// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.tt-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

/* Header */
.tt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  flex-wrap: wrap;
  gap: 12px;
}

/* Role Switcher */
.tt-role-switcher {
  display: flex;
  gap: 4px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
}
.tt-role-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  color: #94a3b8;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: transparent;
}
.tt-role-btn:hover {
  color: #475569;
  background: white;
}
.tt-role-active {
  color: white !important;
  background: #1e293b !important;
  box-shadow: 0 4px 12px -2px rgba(30, 41, 59, 0.25);
}

/* Body */
.tt-body {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f8fafc;
}

/* Cards */
.tt-card {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  transition: all 0.2s ease;
}

/* Tabs */
.tt-tabs {
  display: flex;
  gap: 4px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  width: fit-content;
}
.tt-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  color: #94a3b8;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 0.2s ease;
}
.tt-tab:hover { color: #475569; background: white; }
.tt-tab-active {
  color: #1e293b !important;
  background: white !important;
  box-shadow: 0 2px 8px -2px rgba(0,0,0,0.08);
}

/* Form Elements */
.tt-select {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #334155;
  outline: none;
  transition: all 0.15s;
  cursor: pointer;
}
.tt-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.tt-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #334155;
  outline: none;
  transition: all 0.15s;
}
.tt-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.tt-input::placeholder { color: #cbd5e1; }
.tt-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 6px;
}

/* Buttons */
.tt-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px -2px rgba(59,130,246,0.35);
}
.tt-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px -2px rgba(59,130,246,0.4); }
.tt-btn-primary:active { transform: translateY(0); }
.tt-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.tt-btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  cursor: pointer;
  transition: all 0.2s;
}
.tt-btn-danger:hover { background: #fee2e2; }
.tt-btn-ghost {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  color: #64748b;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}
.tt-btn-ghost:hover { background: #f8fafc; border-color: #cbd5e1; }

/* Grid */
.grid-corner {
  background: #fafbfc;
  border-bottom: 2px solid #e2e8f0;
  border-right: 1px solid #f1f5f9;
  border-radius: 16px 0 0 0;
}
.grid-day-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  background: #fafbfc;
  border-bottom: 2px solid #e2e8f0;
  border-right: 1px solid #f1f5f9;
}
.grid-day-header:last-child {
  border-radius: 0 16px 0 0;
}
.grid-time {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 8px;
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  min-height: 88px;
  background: #fafbfc;
}
.grid-cell-empty {
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  min-height: 88px;
  transition: background 0.2s;
}
.grid-cell-empty:hover {
  background: #f0f9ff;
}
.grid-cell-filled {
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  min-height: 88px;
  padding: 4px;
}

/* Slot Block */
.slot-block {
  position: relative;
  display: flex;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: color-mix(in srgb, var(--slot-color) 8%, white);
  border: 1px solid color-mix(in srgb, var(--slot-color) 15%, white);
  transition: all 0.2s;
}
.slot-block:hover {
  box-shadow: 0 4px 12px -2px color-mix(in srgb, var(--slot-color) 20%, transparent);
  transform: translateY(-1px);
}
.slot-accent {
  width: 4px;
  min-height: 100%;
  border-radius: 4px 0 0 4px;
  flex-shrink: 0;
}
.slot-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
  min-width: 0;
  flex: 1;
}
.slot-title {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.slot-meta {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}
.slot-group {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
  width: fit-content;
}
.slot-room {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: auto;
}
.slot-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  width: fit-content;
}
.slot-type-lecture {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}
.slot-type-lab {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}
.slot-type-makeup {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}
.slot-type-online {
  background: #faf5ff;
  color: #9333ea;
  border: 1px solid #e9d5ff;
}
`;
