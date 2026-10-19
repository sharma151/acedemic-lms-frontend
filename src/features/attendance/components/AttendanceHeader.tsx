"use client";

import React from "react";
import { GraduationCap, BookOpen, ShieldCheck, Building2 } from "lucide-react";
import { AttendanceRole } from "../types";
import { useSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { useGetProfile } from "@/features/profile/api/get-profile";

interface AttendanceHeaderProps {
  activeRole: AttendanceRole;
  tenantName?: string;
}

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  activeRole,
  tenantName,
}) => {
  const { user } = useSession();
  const { data: profileResponse } = useGetProfile();

  // Prefer institution / school name from profile, user session, or fallback
  const displayTenant =
    tenantName ||
    profileResponse?.data?.tenant?.name ||
    (user as any)?.tenant?.name ||
    (user as any)?.tenantName ||
    "Demo Institution";

  const roleMeta: Record<
    AttendanceRole,
    { label: string; icon: React.ReactNode; description: string }
  > = {
    Teacher: {
      label: "Teacher Register",
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      description: "Mark daily student attendance, record session statuses, and view approved leaves.",
    },
    Student: {
      label: "Student Portal",
      icon: <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      description: "View your attendance summary, monthly calendar markers, and submit leave requests.",
    },
    Admin: {
      label: "Administration Overview",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      description: "Monitor institution attendance rates, daily submission matrix, and chronic absenteeism.",
    },
  };

  const currentMeta = roleMeta[activeRole] || roleMeta.Teacher;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
      <div>
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
        <p className="text-sm text-muted-foreground mt-1">
          {currentMeta.description}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/60 dark:bg-secondary/40 border border-border/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
        <Building2 className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold text-foreground">{displayTenant}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
      </div>
    </div>
  );
};
