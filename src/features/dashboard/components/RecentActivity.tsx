"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, UserCheck, School, ShieldAlert, ArrowUpRight } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: "act-1",
      actor: "Rohan Shrestha",
      action: "authorized 2 faculty accounts for",
      target: "PKR_PPSU",
      time: "18m ago",
      icon: UserCheck,
      iconColor: "text-primary bg-accent/60",
    },
    {
      id: "act-2",
      actor: "Anjali Gurung",
      action: "submitted term enrollment manifest for",
      target: "BTL_PPSU",
      time: "1h ago",
      icon: CheckCircle2,
      iconColor: "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
    },
    {
      id: "act-3",
      actor: "Bhaktapur Model School",
      action: "registered new campus profile",
      target: "",
      time: "3h ago",
      icon: School,
      iconColor: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
    },
    {
      id: "act-4",
      actor: "Sunita Thapa",
      action: "adjusted role permissions in",
      target: "KTM_PPSU",
      time: "Yesterday",
      icon: ShieldAlert,
      iconColor: "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
    },
  ];

  return (
    <Card className="col-span-1 border border-border bg-card shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
            System Activity Log
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Audit trail across all tenants
          </CardDescription>
        </div>
        <button
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          aria-label="View all system activities"
        >
          <span>All Events</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="pt-4 flex-1">
        <ol className="relative space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <li key={activity.id} className="relative flex items-start gap-3 pl-1">
                <div
                  className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/80 ${activity.iconColor}`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">{activity.actor}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    {activity.target && (
                      <span className="font-mono font-medium text-primary bg-accent/40 px-1 py-0.2 rounded-xs">
                        {activity.target}
                      </span>
                    )}
                  </p>
                  <span className="text-[11px] font-mono text-muted-foreground block mt-0.5">
                    {activity.time}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
