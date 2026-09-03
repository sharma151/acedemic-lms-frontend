import React from "react";
import { Button } from "@/components/ui/button";
import { StatCards } from "./StatCards";
import { EnrollmentChart } from "./EnrollmentChart";
import { RecentActivity } from "./RecentActivity";
import { PendingApprovals } from "./PendingApprovals";
import { QuickActions } from "./QuickActions";
import { Plus } from "lucide-react";

export function DashboardTemplate({ role = "super-admin" }: { role?: string }) {
  // Normally this data comes from an API or auth context
  const userName = "Saurav";
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Good morning, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening across your {role === "super-admin" ? "institutions" : "platform"} today — {currentDate}
          </p>
        </div>
        {role === "super-admin" && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Add Institution
          </Button>
        )}
      </div>

      {/* Stats row */}
      <StatCards role={role} />

      {/* Middle row: Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnrollmentChart />
        <RecentActivity />
      </div>

      {/* Bottom row: Table and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {role === "super-admin" && <PendingApprovals />}
        <QuickActions role={role} />
      </div>
    </div>
  );
}
