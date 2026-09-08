"use client";

import React from "react";
import { Role } from "@/configs/constants";
import { Button } from "@/components/ui/button";
import { StatCards } from "./StatCards";
import { EnrollmentChart } from "./EnrollmentChart";
import { RecentActivity } from "./RecentActivity";
import { PendingApprovals } from "./PendingApprovals";
import { QuickActions } from "./QuickActions";
import { Plus, Download, Calendar } from "lucide-react";
import { useFormatDate } from "@/hooks/use-format-date";

export function DashboardTemplate({ role = Role.SUPER_ADMIN }: { role?: string }) {
  const userName = "Saurav";
  const { formatDate } = useFormatDate();
  const currentDate = formatDate(new Date(), "DEFAULT");

  return (
    <div className="space-y-6">
      {/* Precision Header Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
              Executive Overview
            </h1>
            <span className="inline-flex items-center rounded-xs bg-accent/60 px-2 py-0.5 text-xs font-mono font-medium text-primary border border-primary/20">
              {role === Role.SUPER_ADMIN ? "SUPER ADMIN PORTAL" : "CAMPUS PORTAL"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">{userName}</span>. System active across all monitored institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground font-mono">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>{currentDate}</span>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-border">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>

          {role === Role.SUPER_ADMIN && (
            <Button size="sm" className="h-8 text-xs gap-1.5 font-medium shadow-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Institution</span>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Metric Strip */}
      <StatCards role={role} />

      {/* Middle row: Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <EnrollmentChart />
        <RecentActivity />
      </div>

      {/* Bottom row: Approvals Table and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {role === Role.SUPER_ADMIN && <PendingApprovals />}
        <QuickActions role={role} />
      </div>
    </div>
  );
}
