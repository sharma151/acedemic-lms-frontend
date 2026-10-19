"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  FileText,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AttendanceStatus,
  AttendanceStudentRow,
  AttendanceFilterOptions,
} from "../types";
import {
  useAttendanceFilters,
  useAttendanceRegister,
  useSubmitAttendance,
} from "../api";

// Avatar colors matching modern UI design tokens
const AVATAR_COLORS = [
  "bg-slate-800 text-white dark:bg-slate-700",
  "bg-emerald-600 text-white",
  "bg-amber-600 text-white",
  "bg-indigo-600 text-white",
  "bg-rose-600 text-white",
  "bg-blue-600 text-white",
  "bg-violet-600 text-white",
  "bg-teal-600 text-white",
];

export const ClassRegisterView: React.FC = () => {
  // Cascading Filter States (initialized to empty until real API options load)
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);

  // Search & Filter Status filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AttendanceStatus>("ALL");

  // Fetch Filter cascading options from backend API
  const { data: filterOptionsData, isLoading: isLoadingFilters } = useAttendanceFilters();
  const filterOptions: AttendanceFilterOptions = filterOptionsData || {
    classes: [],
    sections: [],
    periods: [],
  };

  // Auto-sync initial class, section, and period from API options when loaded
  React.useEffect(() => {
    if (filterOptionsData?.classes && filterOptionsData.classes.length > 0) {
      const classExists = filterOptionsData.classes.some((c) => c.id === selectedClassId);
      if (!selectedClassId || !classExists) {
        const firstClsId = filterOptionsData.defaultClassId || filterOptionsData.classes[0].id;
        setSelectedClassId(firstClsId);
        const matchingSec = filterOptionsData.sections?.find((s) => s.classId === firstClsId);
        if (matchingSec) {
          setSelectedSectionId(matchingSec.id);
        }
      }
    }
  }, [filterOptionsData, selectedClassId]);

  React.useEffect(() => {
    if (!selectedPeriodId && filterOptionsData?.periods && filterOptionsData.periods.length > 0) {
      setSelectedPeriodId(filterOptionsData.defaultPeriodId || filterOptionsData.periods[0].id);
    }
  }, [filterOptionsData, selectedPeriodId]);

  // Filter sections by selected class
  const availableSections = useMemo(() => {
    return filterOptions.sections.filter(
      (sec) => sec.classId === selectedClassId
    );
  }, [filterOptions.sections, selectedClassId]);

  // Fetch Register Data (only enabled when valid UUIDs are present)
  const { data: registerData, isLoading: isLoadingRegister } = useAttendanceRegister(
    {
      class_id: selectedClassId,
      section_id: selectedSectionId,
      date: selectedDate,
      period_id: selectedPeriodId,
    },
    { enabled: Boolean(selectedClassId && selectedSectionId) }
  );

  // Roster local state for live edits & marking
  const [roster, setRoster] = useState<AttendanceStudentRow[]>([]);

  // Sync roster and lock state when remote query updates
  React.useEffect(() => {
    if (registerData) {
      if (registerData.students) {
        setRoster(registerData.students);
      }
      setIsSessionLocked(Boolean(registerData.isLocked));
    }
  }, [registerData]);

  // Submit Mutation
  const submitMutation = useSubmitAttendance({
    onSuccess: () => {
      setIsSessionLocked(true);
    },
  });

  // Status Change Handler
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    if (isSessionLocked) return;
    setRoster((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          if (s.approvedLeave?.status === "APPROVED") {
            return s;
          }
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  // Mark all as Present shortcut
  const handleMarkAllPresent = () => {
    if (isSessionLocked) return;
    setRoster((prev) =>
      prev.map((s) => {
        if (s.approvedLeave?.status === "APPROVED") return s;
        return { ...s, status: "PRESENT" };
      })
    );
  };

  // Handle Class Switch
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const matchingSec = filterOptions.sections.find((s) => s.classId === newClassId);
    if (matchingSec) {
      setSelectedSectionId(matchingSec.id);
    } else {
      setSelectedSectionId("");
    }
  };

  // Submit Handler
  const handleSubmit = () => {
    submitMutation.mutate({
      class_id: selectedClassId,
      section_id: selectedSectionId,
      date: selectedDate,
      period_id: selectedPeriodId,
      records: roster.map((r) => ({
        student_id: r.studentId,
        status: r.status,
        remarks: r.remarks,
      })),
    });
  };

  // Filtered Roster for Search and Status Filter Pills
  const filteredStudents = useMemo(() => {
    return roster.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [roster, searchQuery, statusFilter]);

  // Live Count Metrics
  const counts = useMemo(() => {
    const present = roster.filter((s) => s.status === "PRESENT").length;
    const absent = roster.filter((s) => s.status === "ABSENT").length;
    const late = roster.filter((s) => s.status === "LATE").length;
    const excused = roster.filter((s) => s.status === "EXCUSED").length;
    return {
      total: roster.length,
      present,
      absent,
      late,
      excused,
    };
  }, [roster]);

  // Active labels
  const activeClass =
    filterOptions.classes.find((c) => c.id === selectedClassId)?.name ||
    (isLoadingFilters ? "Loading..." : "Select Class");
  const activeSection =
    filterOptions.sections.find((s) => s.id === selectedSectionId)?.name ||
    "";
  const activePeriod =
    filterOptions.periods.find((p) => p.id === selectedPeriodId)?.name ||
    "Daily General Attendance";

  return (
    <div className="space-y-6 pb-28">
      {/* Subheader Banner matching design theme */}
      <div className="bg-card text-card-foreground border border-border/80 px-6 py-5 rounded-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Attendance Register</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            {activeClass} {activeSection ? `– ${activeSection}` : ""}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Today"} · {activePeriod}
          </p>
        </div>

        {/* Lock Toggle Action */}
        <button
          onClick={() => setIsSessionLocked(!isSessionLocked)}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
            isSessionLocked
              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100"
              : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100"
          )}
        >
          {isSessionLocked ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Session Locked (Click to Edit)</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5" />
              <span>Open for Marking (Unlocked)</span>
            </>
          )}
        </button>
      </div>

      {/* Cascading Filter Box */}
      <div className="bg-card rounded-xl p-5 border border-border/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
              Date
            </label>
            <div className="flex items-center gap-1.5 bg-background border border-input rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split("T")[0]);
                }}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-medium text-foreground w-full focus:outline-none text-center cursor-pointer"
              />
              <button
                type="button"
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split("T")[0]);
                }}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Class Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
              Class
            </label>
            <Select
              value={selectedClassId}
              onValueChange={handleClassChange}
            >
              <SelectTrigger className="w-full bg-background border-input rounded-xl text-xs">
                <SelectValue placeholder={isLoadingFilters ? "Loading classes..." : "Select Class"} />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id} className="text-xs">
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
              Section
            </label>
            <Select
              value={selectedSectionId}
              onValueChange={setSelectedSectionId}
              disabled={availableSections.length === 0}
            >
              <SelectTrigger className="w-full bg-background border-input rounded-xl text-xs">
                <SelectValue placeholder={availableSections.length === 0 ? "No sections" : "Select Section"} />
              </SelectTrigger>
              <SelectContent>
                {availableSections.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id} className="text-xs">
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
              Period / Session
            </label>
            <Select
              value={selectedPeriodId}
              onValueChange={setSelectedPeriodId}
            >
              <SelectTrigger className="w-full bg-background border-input rounded-xl text-xs">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.periods.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Roster Controls: Search + Filter Pills + Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-input rounded-xl text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("PRESENT")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "PRESENT"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            Present {counts.present}
          </button>
          <button
            onClick={() => setStatusFilter("ABSENT")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "ABSENT"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            Absent {counts.absent}
          </button>
          <button
            onClick={() => setStatusFilter("LATE")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "LATE"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            Late {counts.late}
          </button>
          <button
            onClick={() => setStatusFilter("EXCUSED")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              statusFilter === "EXCUSED"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-card text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            Excused {counts.excused}
          </button>
        </div>

        {/* Mark All Present & Counts badge */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!isSessionLocked && roster.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllPresent}
              className="text-xs font-medium border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Mark All Present
            </Button>
          )}

          <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>{counts.total} Students</span>
          </div>
        </div>
      </div>

      {/* Interactive Student Table */}
      <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/40">
                <th className="py-3.5 px-6 w-16">Roll</th>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right w-20">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {isLoadingRegister || isLoadingFilters ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading attendance register...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    <span>No students found in this class register.</span>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const initials = `${student.firstName[0] || ""}${student.lastName[0] || ""}`;
                  const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const hasApprovedLeave =
                    student.approvedLeave?.status === "APPROVED";

                  return (
                    <tr
                      key={student.studentId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Roll No */}
                      <td className="py-3.5 px-6 font-mono font-bold text-muted-foreground">
                        {student.rollNumber}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs",
                              colorClass
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {student.firstName} {student.lastName}
                            </div>
                            {hasApprovedLeave && (
                              <span className="inline-block mt-0.5 text-[10px] font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 px-2 py-0.5 rounded-full">
                                {student.approvedLeave?.type} - APPROVED
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status Toggles */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present */}
                          <button
                            type="button"
                            disabled={isSessionLocked || hasApprovedLeave}
                            onClick={() =>
                              handleStatusChange(student.studentId, "PRESENT")
                            }
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                              student.status === "PRESENT"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            )}
                          >
                            Present
                          </button>

                          {/* Absent */}
                          <button
                            type="button"
                            disabled={isSessionLocked || hasApprovedLeave}
                            onClick={() =>
                              handleStatusChange(student.studentId, "ABSENT")
                            }
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                              student.status === "ABSENT"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            )}
                          >
                            Absent
                          </button>

                          {/* Late */}
                          <button
                            type="button"
                            disabled={isSessionLocked || hasApprovedLeave}
                            onClick={() =>
                              handleStatusChange(student.studentId, "LATE")
                            }
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                              student.status === "LATE"
                                ? "bg-amber-600 text-white shadow-xs"
                                : "text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                            )}
                          >
                            Late
                          </button>

                          {/* Excused */}
                          <button
                            type="button"
                            disabled={isSessionLocked}
                            onClick={() =>
                              handleStatusChange(student.studentId, "EXCUSED")
                            }
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                              student.status === "EXCUSED"
                                ? "bg-purple-600 text-white shadow-xs"
                                : "text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/30"
                            )}
                          >
                            Excused
                          </button>
                        </div>
                      </td>

                      {/* Remarks note indicator */}
                      <td className="py-3.5 px-6 text-right">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title={student.remarks || "Add note"}
                        >
                          <FileText className="w-4 h-4 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Sticky Bar matching application design theme */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-4xl z-30">
        <div className="bg-card/95 backdrop-blur-md text-card-foreground px-6 py-3.5 rounded-2xl shadow-xl border border-border flex items-center justify-between gap-4">
          {/* Tally Metrics */}
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-base font-bold text-foreground">{counts.total}</div>
              <div className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Total
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {counts.present}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Present
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-rose-600 dark:text-rose-400">
                {counts.absent}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Absent
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-amber-600 dark:text-amber-400">
                {counts.late}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
                Late
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          {isSessionLocked ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSessionLocked(false)}
              className="flex items-center gap-2 text-xs font-semibold rounded-xl border-border hover:bg-muted cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Session Locked · Click to Edit</span>
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || roster.length === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {submitMutation.isPending ? "Submitting..." : "Submit Attendance"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
