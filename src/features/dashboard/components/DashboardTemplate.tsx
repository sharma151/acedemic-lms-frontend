"use client";

import React, { useMemo } from "react";
import { Role } from "@/configs/constants";
import { Button } from "@/components/ui/button";
import { StatCards } from "./StatCards";
import { EnrollmentChart } from "./EnrollmentChart";
import { RecentActivity } from "./RecentActivity";
import { PendingApprovals } from "./PendingApprovals";
import { QuickActions } from "./QuickActions";
import { Plus, Download, Calendar, LayoutDashboard, Sparkles } from "lucide-react";
import { useFormatDate } from "@/hooks/use-format-date";
import { useGetProfile } from "@/features/profile/api/get-profile";
import { useSession } from "@/lib/session";

export function DashboardTemplate({ role = Role.SUPER_ADMIN }: { role?: string }) {
  const { data: profileResponse } = useGetProfile();
  const sessionUser = useSession((s) => s.user);
  const meUser = profileResponse?.data || sessionUser;

  const userName = meUser?.firstName
    ? `${meUser.firstName} ${meUser.lastName || ""}`.trim()
    : meUser?.email || "User";

  const { formatDate } = useFormatDate();
  const currentDate = formatDate(new Date(), "DEFAULT");

  // Determine user permissions and roles
  const { isTeacher, isStudent, isSuperAdmin, isInstitutionAdmin, hasPermission, badgeText, headerTitle } = useMemo(() => {
    const rawRole = (meUser?.role || role || "").toLowerCase();
    const teacher = rawRole.includes("teacher");
    const student = rawRole.includes("student") || rawRole.includes("parent");
    const superAdmin =
      role === Role.SUPER_ADMIN ||
      rawRole === "super admin" ||
      rawRole === "super-admin" ||
      rawRole === "superadmin";
    const instAdmin = rawRole.includes("admin") && !superAdmin;

    // Students and teachers do not have permission for the administrative dashboard APIs
    const allowed = (superAdmin || instAdmin) && !teacher && !student;

    const badge = superAdmin
      ? "SUPER ADMIN PORTAL"
      : teacher
      ? "TEACHER PORTAL"
      : student
      ? "STUDENT PORTAL"
      : "CAMPUS PORTAL";

    const title = superAdmin
      ? "Executive Overview"
      : instAdmin
      ? "Campus Executive Overview"
      : teacher
      ? "Teacher Dashboard"
      : student
      ? "Student Dashboard"
      : "Dashboard";

    return {
      isTeacher: teacher,
      isStudent: student,
      isSuperAdmin: superAdmin,
      isInstitutionAdmin: instAdmin,
      hasPermission: allowed,
      badgeText: badge,
      headerTitle: title,
    };
  }, [meUser?.role, role]);

  return (
    <div className="space-y-6">
      {/* Precision Header Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
              {headerTitle}
            </h1>
            <span className="inline-flex items-center rounded-xs bg-accent/60 px-2 py-0.5 text-xs font-mono font-medium text-primary border border-primary/20">
              {badgeText}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">{userName}</span>.{" "}
            {hasPermission
              ? "System active across all monitored institutions."
              : "Welcome to your academic workspace portal."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground font-mono">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{currentDate}</span>
          </div>

          {hasPermission && (
            <>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-border">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export Report</span>
              </Button>

              {isSuperAdmin && (
                <Button size="sm" className="h-8 text-xs gap-1.5 font-medium shadow-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Institution</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* When user does not have permission (Teachers & Students), render an empty dashboard state */}
      {!hasPermission ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {isTeacher ? "Teacher Portal Active" : isStudent ? "Student Portal Active" : "Workspace Ready"}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            {isTeacher
              ? "Welcome to your teacher dashboard. Institutional analytics and matriculation trends are restricted to campus administrators. Use the navigation sidebar to record attendance, manage classes, and view academic schedules."
              : isStudent
              ? "Welcome to your student dashboard. Institutional enrollment analytics are restricted to campus administrators. Use the navigation sidebar to inspect your attendance, submit leave applications, and view subjects."
              : "Administrative analytics and enrollment dynamics are restricted to campus administrators. Use the navigation sidebar to access your workspace."}
          </p>
        </div>
      ) : (
        <>
          {/* Stats Metric Strip */}
          <StatCards role={role} />

          {/* Middle row: Chart and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <EnrollmentChart />
            <RecentActivity />
          </div>

          {/* Bottom row: Approvals Table and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {isSuperAdmin && <PendingApprovals />}
            <QuickActions role={role} />
          </div>
        </>
      )}
    </div>
  );
}
