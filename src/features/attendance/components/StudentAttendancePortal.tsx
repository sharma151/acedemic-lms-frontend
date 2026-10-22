"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  UserX,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AttendanceRingChart } from "./AttendanceRingChart";
import { AttendanceCalendar } from "./AttendanceCalendar";
import { LeaveRequestModal } from "./LeaveRequestModal";
import { AttendanceHeader } from "./AttendanceHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useAttendanceSummary,
  useAttendanceSubjectWise,
  useAttendanceCalendar,
  useLeaveRequests,
} from "../api";
import { useSession } from "@/lib/session";

interface StudentAttendancePortalProps {
  studentId?: string;
}

export const StudentAttendancePortal: React.FC<StudentAttendancePortalProps> = ({
  studentId,
}) => {
  const { user } = useSession();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Queries (omit dummy studentId so backend auto-resolves logged-in student)
  const queryParams = studentId ? { studentId } : undefined;
  const { data: summaryData, isLoading: isLoadingSummary } = useAttendanceSummary(queryParams);
  const { data: subjectWiseData, isLoading: isLoadingSubjects } = useAttendanceSubjectWise(queryParams);
  const { data: calendarData, isLoading: isLoadingCalendar, refetch: refetchCalendar } = useAttendanceCalendar({
    ...(studentId ? { studentId } : {}),
    month: currentMonth,
    year: currentYear,
  });
  const { data: leavesData, isLoading: isLoadingLeaves, refetch: refetchLeaves } = useLeaveRequests(queryParams);

  const summary = summaryData || {
    studentId: "",
    studentName: "",
    className: "",
    sectionName: "",
    rollNumber: "",
    attendanceRate: 0,
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    excusedDays: 0,
  };
  const subjects = subjectWiseData || [];
  const calendarDays = calendarData || [];
  const leaves = leavesData || [];

  const displayName =
    summary.studentName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.email ||
    "Student";

  return (
    <div className="space-y-6">
      {/* Student Attendance Page Header */}
      <AttendanceHeader
        activeRole="Student"
        studentData={{
          name: displayName,
          className: summary.className || "Class Enrolled",
          sectionName: summary.sectionName || "Section A",
          rollNumber: summary.rollNumber,
        }}
        actions={
          <Button
            size="sm"
            onClick={() => setIsLeaveModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Apply for Leave
          </Button>
        }
      />

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attendance Rate Ring */}
        <div className="bg-card rounded-xl p-5 border border-border/80 shadow-xs flex flex-col items-center justify-between text-center min-h-[170px]">
          <AttendanceRingChart percentage={summary.attendanceRate} size={110} strokeWidth={9} />
          <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mt-2">
            Attendance Rate
          </div>
        </div>

        {/* Card 2: Days Present */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {summary.presentDays}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Days Present
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              of {summary.totalDays} total sessions
            </div>
          </div>
        </div>

        {/* Card 3: Days Absent */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
              {summary.absentDays}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Days Absent
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {summary.lateDays} unexcused late
            </div>
          </div>
        </div>

        {/* Card 4: Excused Days */}
        <div className="bg-card rounded-xl p-6 border border-border/80 shadow-xs flex flex-col justify-between min-h-[170px]">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {summary.excusedDays}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              Excused Days
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              with verified leave
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Subject Breakdown + Monthly Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject-wise Attendance Table (7 cols) */}
        <div className="lg:col-span-7 bg-card rounded-xl border border-border/80 shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Subject-wise Attendance Breakdown
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/30">
                  <th className="py-2.5 px-3 font-semibold">Subject</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Held</th>
                  <th className="py-2.5 px-3 text-center font-semibold">Attended</th>
                  <th className="py-2.5 px-3 text-center font-semibold">%</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoadingSubjects ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Loading subjects...</span>
                      </div>
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <CalendarIcon className="w-6 h-6 text-muted-foreground/30" />
                        <p className="text-xs font-medium text-foreground">No subject breakdown recorded</p>
                        <p className="text-[11px] text-muted-foreground">Subject-level attendance statistics will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  subjects.map((sub) => {
                    let statusBadgeClass = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60";
                    if (sub.status === "Warning") {
                      statusBadgeClass = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60";
                    } else if (sub.status === "Danger") {
                      statusBadgeClass = "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60";
                    }

                    let percentColor = "text-emerald-600 dark:text-emerald-400";
                    if (sub.percentage < 75) percentColor = "text-rose-600 dark:text-rose-400";
                    else if (sub.percentage < 85) percentColor = "text-amber-600 dark:text-amber-400";

                    return (
                      <tr key={sub.subjectId} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 font-medium text-foreground">
                          {sub.subjectName}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-muted-foreground">
                          {sub.classesHeld}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-muted-foreground">
                          {sub.classesAttended}
                        </td>
                        <td className={cn("py-3 px-3 text-center font-bold font-mono", percentColor)}>
                          {sub.percentage}%
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={cn(
                              "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                              statusBadgeClass
                            )}
                          >
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Attendance Calendar (5 cols) */}
        <div className="lg:col-span-5">
          <AttendanceCalendar daysData={calendarDays} />
        </div>
      </div>

      {/* Bottom Section: Leave Requests */}
      <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Leave Requests History</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review submission status and approved medical or personal excuses.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase bg-muted/30">
                <th className="py-2.5 px-3 font-semibold">Dates</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Reason</th>
                <th className="py-2.5 px-3 font-semibold">Applied</th>
                <th className="py-2.5 px-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoadingLeaves ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading leave requests...</span>
                    </div>
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Clock className="w-6 h-6 text-muted-foreground/30" />
                      <p className="text-xs font-medium text-foreground">No leave requests found</p>
                      <p className="text-[11px] text-muted-foreground">You have not submitted any leave applications yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaves.map((lv) => {
                  let badge = (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> APPROVED
                    </span>
                  );
                  if (lv.status === "PENDING") {
                    badge = (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    );
                  } else if (lv.status === "REJECTED") {
                    badge = (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> REJECTED
                      </span>
                    );
                  }

                  return (
                    <tr key={lv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {lv.fromDate} → {lv.toDate}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-secondary text-[10px] font-medium text-secondary-foreground border border-border">
                          {typeof lv.leaveType === "object"
                            ? (lv.leaveType as any)?.type || (lv.leaveType as any)?.name || "Leave"
                            : String(lv.leaveType || "Leave")}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-foreground max-w-xs">
                        <div className="font-medium text-xs">{lv.reason}</div>
                        {lv.reviewNote && (
                          <div className="text-[11px] text-muted-foreground mt-0.5 italic">
                            Reviewer note: "{lv.reviewNote}"
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">
                        {lv.appliedOn ? lv.appliedOn.split("T")[0] : "—"}
                      </td>
                      <td className="py-3 px-3 text-right">{badge}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application Dialog */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
        defaultStudentId={studentId}
        onSuccess={() => {
          refetchLeaves();
          refetchCalendar();
        }}
      />
    </div>
  );
};
