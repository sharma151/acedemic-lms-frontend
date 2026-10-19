"use client";

import React, { useMemo } from "react";
import { AttendanceRole } from "../types";
import { AttendanceHeader } from "./AttendanceHeader";
import { ClassRegisterView } from "./ClassRegisterView";
import { StudentAttendancePortal } from "./StudentAttendancePortal";
import { AdminAttendanceDashboard } from "./AdminAttendanceDashboard";
import { useSession } from "@/lib/session";

export const AttendancePageTemplate: React.FC = () => {
  const { user, isInitializing } = useSession();

  // Switch UI strictly according to the /auth/me user role (no tab switcher)
  const activeRole: AttendanceRole = useMemo(() => {
    const roleLower = user?.role?.toLowerCase() || "";
    if (roleLower.includes("admin")) return "Admin";
    if (roleLower.includes("student") || roleLower.includes("parent")) return "Student";
    return "Teacher";
  }, [user?.role]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Loading attendance workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header aligned with application color theme */}
      <AttendanceHeader activeRole={activeRole} />

      {/* Main View Area strictly driven by me API user role */}
      <main className="w-full">
        {activeRole === "Teacher" && <ClassRegisterView />}
        {activeRole === "Student" && <StudentAttendancePortal />}
        {activeRole === "Admin" && <AdminAttendanceDashboard />}
      </main>
    </div>
  );
};
