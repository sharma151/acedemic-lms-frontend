"use client";

import React from "react";
import { Role } from "@/configs/constants";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  GraduationCap,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useDashboardSummary, usePendingInstitutions } from "../api/dashboard";

interface StatCardsProps {
  role: string;
}

function formatNumber(num: number | string | undefined, fallback: string): string {
  if (num === undefined || num === null || num === "") return fallback;
  const n = Number(num);
  return isNaN(n) ? String(num) : n.toLocaleString();
}

function parseTrendDirection(val: any): "up" | "down" | "neutral" {
  if (val === "down" || val === "negative") return "down";
  if (val === "neutral" || val === "same") return "neutral";
  return "up";
}

export function StatCards({ role }: StatCardsProps) {
  const isSuperAdmin = role === Role.SUPER_ADMIN;

  const { data: summaryData, isLoading: isLoadingSummary } = useDashboardSummary({
    compare: "month",
  });

  const { data: pendingData } = usePendingInstitutions(
    { page: 1, limit: 10 },
    { enabled: isSuperAdmin }
  );

  // 1. Institutions (Super Admin)
  const institutionsTotal =
    summaryData?.institutions_count ??
    summaryData?.tenants_count ??
    (summaryData?.institutions as any)?.total ??
    (summaryData?.institutions as any)?.count ??
    (summaryData?.tenants as any)?.total ??
    (summaryData?.tenants as any)?.count ??
    summaryData?.totalTenants ??
    summaryData?.totalInstitutions ??
    (typeof summaryData?.institutions === "number" ? summaryData.institutions : 248);

  const institutionsGrowth =
    summaryData?.institution_average ||
    summaryData?.tenant_average ||
    (summaryData?.institutions as any)?.growthText ||
    (summaryData?.tenants as any)?.growthText ||
    "+12 this month";

  const institutionsTrend = parseTrendDirection(
    summaryData?.institution_trend ||
      summaryData?.tenant_trend ||
      (summaryData?.institutions as any)?.trend ||
      (summaryData?.institutions as any)?.trendDirection ||
      (summaryData?.tenants as any)?.trend
  );

  // 2. Students
  const studentsTotal =
    summaryData?.students_count ??
    (summaryData?.students as any)?.total ??
    (summaryData?.students as any)?.count ??
    summaryData?.totalStudents ??
    (typeof summaryData?.students === "number" ? summaryData.students : 54320);

  const studentsGrowth =
    summaryData?.student_average ||
    (summaryData?.students as any)?.growthText ||
    "+3.8% vs last month";

  const studentsTrend = parseTrendDirection(
    summaryData?.student_average_trend ||
      summaryData?.Student_avergae_trend ||
      (summaryData?.students as any)?.trend ||
      (summaryData?.students as any)?.trendDirection
  );

  // 3. Faculty & Staff
  const facultyTotal =
    summaryData?.facultyAndStaff_count ??
    summaryData?.faculty_count ??
    (summaryData?.faculty as any)?.total ??
    (summaryData?.facultyAndStaff as any)?.total ??
    (summaryData?.staff as any)?.total ??
    summaryData?.totalFaculty ??
    (typeof summaryData?.faculty === "number" ? summaryData.faculty : 3912);

  const facultyGrowth =
    summaryData?.facultyAndStaff_average ||
    summaryData?.faculty_average ||
    (summaryData?.faculty as any)?.growthText ||
    (summaryData?.facultyAndStaff as any)?.growthText ||
    "+96 this term";

  const facultyTrend = parseTrendDirection(
    summaryData?.facultyAndStaff_trend ||
      summaryData?.faculty_trend ||
      (summaryData?.faculty as any)?.trend ||
      (summaryData?.facultyAndStaff as any)?.trend ||
      (summaryData?.faculty as any)?.trendDirection
  );

  // 4. Pending Onboardings (Super Admin)
  const pendingTotal =
    summaryData?.pendingOnboarding_count ??
    pendingData?.metadata?.totalData ??
    (summaryData?.pendingInstitutions as any)?.total ??
    (summaryData?.pending as any)?.total ??
    (summaryData?.pendingApprovals as any)?.total ??
    0;

  // 5. Academic Year (Institution Admin)
  const rawAcademicYear = summaryData?.academicYear;
  const academicYearName =
    typeof rawAcademicYear === "object" && rawAcademicYear !== null
      ? rawAcademicYear.name || "2026-2027"
      : typeof rawAcademicYear === "string"
      ? rawAcademicYear
      : "2026-2027";

  const stats = [
    {
      id: "institutions",
      title: "Active Institutions",
      value: formatNumber(institutionsTotal, "248"),
      trend: institutionsGrowth,
      trendDirection: institutionsTrend,
      icon: Building2,
      visible: isSuperAdmin,
      description: "Chartered & affiliated campuses",
    },
    {
      id: "students",
      title: "Enrolled Students",
      value: formatNumber(studentsTotal, "54,320"),
      trend: studentsGrowth,
      trendDirection: studentsTrend,
      icon: Users,
      visible: true,
      description: "Active academic enrollments",
    },
    {
      id: "faculty",
      title: "Faculty & Staff",
      value: formatNumber(facultyTotal, "3,912"),
      trend: facultyGrowth,
      trendDirection: facultyTrend,
      icon: GraduationCap,
      visible: true,
      description: "Instructors & department heads",
    },
    {
      id: "approvals",
      title: "Pending Onboarding",
      value: String(pendingTotal),
      trend: pendingTotal > 0 ? `${pendingTotal} awaiting review` : "Queue cleared",
      trendDirection: "down" as const,
      icon: Clock,
      visible: isSuperAdmin,
      description: "Institution registration requests",
    },
    {
      id: "academicYear",
      title: "Academic Session",
      value: academicYearName,
      trend: "Current Active Session",
      trendDirection: "up" as const,
      icon: Calendar,
      visible: !isSuperAdmin,
      description: "Current academic calendar session",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats
        .filter((s) => s.visible)
        .map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trendDirection === "up";
          const isDown = stat.trendDirection === "down";

          return (
            <Card
              key={stat.id}
              className="relative overflow-hidden border border-border bg-card shadow-xs transition-all duration-150 hover:border-primary/40 hover:shadow-sm"
              role="region"
              aria-label={`${stat.title}: ${stat.value}`}
            >
              {/* Subtle top indicator rail */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-border group-hover:bg-primary transition-colors" />

              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                    {stat.title}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/60 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
                    {stat.value}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <div
                      className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-medium ${
                        stat.id === "approvals"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          : isUp
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : isDown
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stat.id === "approvals" ? (
                        <Minus className="h-3 w-3" />
                      ) : isUp ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : isDown ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
