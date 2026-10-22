"use client";

import React from "react";
import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { AttendanceRole } from "../types";
import { useSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";

export interface AttendanceStudentHeaderData {
  name?: string;
  className?: string;
  sectionName?: string;
  rollNumber?: string;
}

export interface AttendanceHeaderProps {
  activeRole: AttendanceRole;
  dateString?: string;
  subtitle?: React.ReactNode;
  studentData?: AttendanceStudentHeaderData;
  actions?: React.ReactNode;
}

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  activeRole,
  dateString,
  subtitle,
  studentData,
  actions,
}) => {
  const { user } = useSession();

  const roleMeta: Record<
    AttendanceRole,
    { label: string; icon: React.ReactNode; defaultDescription: string }
  > = {
    Teacher: {
      label: "Teacher Register",
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      defaultDescription: "Mark daily student attendance, record session statuses, and view approved leaves.",
    },
    Student: {
      label: "Student Portal",
      icon: <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      defaultDescription: "View your attendance summary, monthly calendar markers, and submit leave requests.",
    },
    Admin: {
      label: "Administration Overview",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      defaultDescription: "Monitor institution attendance rates, daily submission matrix, and chronic absenteeism.",
    },
  };

  const currentMeta = roleMeta[activeRole] || roleMeta.Teacher;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Attendance
          </h1>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border border-border"
          >
            {currentMeta.icon}
            <span>{user?.role || currentMeta.label}</span>
          </Badge>
        </div>

        {studentData ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground pt-0.5">
            <span className="font-semibold text-foreground text-base">
              {studentData.name || "Student"}
            </span>
            {(studentData.className || studentData.sectionName) && (
              <>
                <span>·</span>
                <span>
                  {studentData.className || "Class Enrolled"}
                  {studentData.sectionName ? ` · ${studentData.sectionName}` : ""}
                </span>
              </>
            )}
            {studentData.rollNumber && (
              <>
                <span>·</span>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-md border border-border/60">
                  Roll {studentData.rollNumber}
                </span>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground pt-0.5">
            {dateString ? (
              <>
                <span className="font-medium text-foreground">{dateString}</span>
                {subtitle && <span> · {subtitle}</span>}
              </>
            ) : (
              subtitle || currentMeta.defaultDescription
            )}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
