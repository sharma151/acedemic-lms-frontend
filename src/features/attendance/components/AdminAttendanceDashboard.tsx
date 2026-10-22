"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Users,
  Bell,
  Search,
  Download,
  AlertTriangle,
  AlertCircle,
  FolderOpen,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAttendanceOverviewStats,
  useAttendanceDailyMatrix,
  useChronicAbsenteeism,
  useLeaveRequests,
  useRemindTeacher,
  attendanceService,
} from "../api";
import { LeaveRequestsReviewSection } from "./LeaveRequestsReviewSection";
import { AttendanceHeader } from "./AttendanceHeader";
import { useSession } from "@/lib/session";
import { Role } from "@/configs/constants";

export const AdminAttendanceDashboard: React.FC = () => {
  const { user } = useSession();
  const isSuperAdmin =
    user?.role === Role.SUPER_ADMIN ||
    user?.role?.toLowerCase() === "super-admin" ||
    !user?.tenantId;

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("ALL");
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [remindingTeacherId, setRemindingTeacherId] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Real Queries to Backend (No Mock Data Fallbacks)
  const { data: statsData, isLoading: isLoadingStats } = useAttendanceOverviewStats(todayStr);
  const { data: matrixData, isLoading: isLoadingMatrix } = useAttendanceDailyMatrix(todayStr);
  const { data: chronicData, isLoading: isLoadingChronic } = useChronicAbsenteeism();
  const { data: leavesData } = useLeaveRequests();

  const pendingLeavesCount = useMemo(() => {
    if (!Array.isArray(leavesData)) return 0;
    return leavesData.filter((l) => String(l?.status || "").toUpperCase() === "PENDING").length;
  }, [leavesData]);

  const stats = statsData || {
    submittedClassesCount: 0,
    pendingClassesCount: 0,
    totalClassesCount: 0,
    totalStudentsEnrolled: 0,
    totalStudentsPresentToday: 0,
    schoolAttendanceRate: 0,
  };
  const matrix = matrixData || [];
  const chronicList = chronicData || [];

  // Remind Teacher Mutation
  const remindMutation = useRemindTeacher({
    onSuccess: () => {
      setRemindingTeacherId(null);
    },
    onError: () => {
      setRemindingTeacherId(null);
    },
  });

  const handleRemind = (teacherId: string, classId: string, className?: string, sectionName?: string) => {
    setRemindingTeacherId(teacherId);
    remindMutation.mutate({
      teacher_id: teacherId,
      class_id: classId,
      teacherId,
      class: className || "Grade 10",
      section: sectionName || "A",
      date: todayStr,
    });
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await attendanceService.exportChronicAbsenteeismCsv(todayStr);
    } catch {
      // Fallback CSV download if direct binary download fails
      const csvHeader = "Student,Roll,Class,Absent Days,Attendance %,Last Present,Parent Contact\n";
      const csvRows = chronicList
        .map(
          (c) =>
            `"${c.studentName}","${c.rollNumber}","${c.className} - ${c.sectionName}",${c.absentDays},${c.attendancePercentage}%,"${c.lastPresentDate}","${c.parentContact?.phone || ""}"`
        )
        .join("\n");
      const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `chronic_absenteeism_${todayStr}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  // Distinct classes for matrix dropdown
  const classOptions = useMemo(() => {
    const set = new Set<string>();
    matrix.forEach((r) => {
      if (r.className) set.add(r.className);
    });
    return Array.from(set);
  }, [matrix]);

  // Filtered Matrix Rows
  const filteredMatrix = useMemo(() => {
    if (selectedClassFilter === "ALL") return matrix;
    return matrix.filter((row) => row.className === selectedClassFilter);
  }, [matrix, selectedClassFilter]);

  // Filtered Chronic Absenteeism
  const filteredChronic = useMemo(() => {
    return chronicList.filter((item) => {
      const q = searchStudentQuery.toLowerCase();
      return (
        item.studentName.toLowerCase().includes(q) ||
        item.rollNumber.toLowerCase().includes(q) ||
        item.className.toLowerCase().includes(q)
      );
    });
  }, [chronicList, searchStudentQuery]);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header aligned with application color theme */}
      <AttendanceHeader
        activeRole="Admin"
        dateString={formattedDate}
        subtitle="Real-time institution submission oversight"
      />

      {/* Super Admin Notice if no tenant is attached to session */}
      {isSuperAdmin && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-sm text-foreground">Super Admin Institutional Scope Notice</p>
            <p className="text-muted-foreground">
              Attendance records, registers, and chronic absenteeism logs are strictly isolated per tenant institution.
              Since this Super Admin account operates at the global platform level without an assigned tenant, backend attendance APIs return no data.
              To inspect live attendance records, please log in as an <strong>Institution Admin</strong> or <strong>Teacher</strong> belonging to an active campus.
            </p>
          </div>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Submitted */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.submittedClassesCount}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Submitted
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              of {stats.totalClassesCount} total classes
            </div>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.pendingClassesCount}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Pending
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              awaiting submission
            </div>
          </div>
        </div>

        {/* Card 3: Total Students */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalStudentsEnrolled}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Enrolled Students
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              active in semester
            </div>
          </div>
        </div>

        {/* Card 4: Present Today */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalStudentsPresentToday}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Present Today
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {stats.schoolAttendanceRate}% overall rate
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Administration Workspace */}
      <Tabs defaultValue="matrix" className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <TabsList className="bg-muted/70 p-1 rounded-xl border border-border/80 h-auto">
            <TabsTrigger
              value="matrix"
              className="text-xs font-semibold rounded-lg px-3.5 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              Daily Submission Matrix
            </TabsTrigger>
            <TabsTrigger
              value="leaves"
              className="text-xs font-semibold rounded-lg px-3.5 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Leave Applications</span>
              {pendingLeavesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold ml-1">
                  {pendingLeavesCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="chronic"
              className="text-xs font-semibold rounded-lg px-3.5 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Chronic Absenteeism</span>
              {chronicList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold ml-1">
                  {chronicList.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Daily Submission Matrix */}
        <TabsContent value="matrix" className="space-y-6 mt-0">
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Daily Submission Matrix
                  </h3>
                </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              {stats.pendingClassesCount} Pending
            </span>
          </div>

          <div className="w-44">
            <Select
              value={selectedClassFilter}
              onValueChange={setSelectedClassFilter}
            >
              <SelectTrigger className="w-full text-xs bg-background border-input rounded-xl">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  All Classes
                </SelectItem>
                {classOptions.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/30">
                <th className="py-3 px-4 font-semibold">Class / Section</th>
                <th className="py-3 px-4 font-semibold">Teacher</th>
                <th className="py-3 px-4 text-center font-semibold">Students</th>
                <th className="py-3 px-4 text-center font-semibold">Present</th>
                <th className="py-3 px-4 text-center font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoadingMatrix ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading submission matrix...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMatrix.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-foreground">No submission records found</p>
                      <p className="text-xs text-muted-foreground">
                        {isSuperAdmin
                          ? "No institution selected. Attendance matrix is recorded per institution."
                          : `No class attendance submissions were recorded for ${todayStr}.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMatrix.map((row, i) => {
                  const isPending = row.status === "Pending";
                  const isThisReminding = remindingTeacherId === row.teacherId;

                  return (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      {/* Class / Section */}
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div>{row.className}</div>
                        <div className="text-[11px] text-muted-foreground font-normal">
                          {row.sectionName}
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-[10px]">
                            {row.teacherAvatar || "TR"}
                          </div>
                          <span className="font-semibold text-foreground">
                            {row.teacherName}
                          </span>
                        </div>
                      </td>

                      {/* Total Students */}
                      <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                        {row.totalStudents}
                      </td>

                      {/* Present */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {row.presentStudents !== null ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {row.presentStudents} / {row.totalStudents}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {row.status === "Submitted" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <Button
                            size="sm"
                            disabled={isThisReminding}
                            onClick={() => handleRemind(row.teacherId, row.classId, row.className, row.sectionName)}
                            className="text-[11px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-7 px-3 cursor-pointer shadow-xs"
                          >
                            <Bell className="w-3 h-3 mr-1" />
                            {isThisReminding ? "Sending..." : "Remind"}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Leave Applications */}
        <TabsContent value="leaves" className="space-y-6 mt-0">
          <LeaveRequestsReviewSection userRole="Admin" />
        </TabsContent>

        {/* Tab 3: Chronic Absenteeism */}
        <TabsContent value="chronic" className="space-y-6 mt-0">
          <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Chronic Absenteeism Monitoring
              </h3>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
              {chronicList.length} Students Flagged (&lt;75%)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search students..."
                value={searchStudentQuery}
                onChange={(e) => setSearchStudentQuery(e.target.value)}
                className="pl-8 text-xs bg-background border-input rounded-xl h-8"
              />
            </div>

            {/* Export CSV Button */}
            <Button
              size="sm"
              variant="outline"
              disabled={isExporting}
              onClick={handleExportCsv}
              className="text-xs font-semibold rounded-xl border-input h-8 hover:bg-muted cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/30">
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Class</th>
                <th className="py-3 px-4 text-center font-semibold">Absent Days</th>
                <th className="py-3 px-4 font-semibold">Attendance</th>
                <th className="py-3 px-4 font-semibold">Last Present</th>
                <th className="py-3 px-4 text-right font-semibold">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoadingChronic ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading chronic absenteeism records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredChronic.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
                      <p className="text-sm font-medium text-foreground">
                        {searchStudentQuery
                          ? "No matching students found"
                          : "No students flagged for chronic absenteeism"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {searchStudentQuery
                          ? `No student matching "${searchStudentQuery}" was found.`
                          : isSuperAdmin
                          ? "No institution selected. Chronic absenteeism logs are maintained per campus."
                          : "All enrolled students currently maintain an attendance rate of 75% or higher."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredChronic.map((student) => {
                  const initials = (student.studentName || "ST")
                    .split(" ")
                    .map((n) => n[0])
                    .join("");

                  return (
                    <tr
                      key={student.studentId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center font-bold text-[10px]">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">
                              {student.studentName}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              Roll {student.rollNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4 font-medium text-muted-foreground">
                        {student.className} · {student.sectionName}
                      </td>

                      {/* Absent Days */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-500 text-sm">
                        {student.absentDays}
                      </td>

                      {/* Attendance Bar */}
                      <td className="py-3.5 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${student.attendancePercentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold font-mono text-foreground w-11 text-right">
                            {student.attendancePercentage}%
                          </span>
                        </div>
                      </td>

                      {/* Last Present Date */}
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        {student.lastPresentDate}
                      </td>

                      {/* Parent Contact */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-semibold text-foreground">
                          {student.parentContact?.phone || "+1 (555) 000 0000"}
                        </div>
                        {student.parentContact?.email && (
                          <div className="text-[11px] text-muted-foreground">
                            {student.parentContact.email}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      </TabsContent>
    </Tabs>
  </div>
  );
};
