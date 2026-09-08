"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";

export function PendingApprovals() {
  const approvals = [
    {
      id: "app-1",
      institution: "Bhaktapur Model School",
      province: "Bagmati",
      submitted: "Sep 2, 2026",
      tier: "Enterprise Tier",
      status: "Pending",
    },
    {
      id: "app-2",
      institution: "Pokhara Valley College",
      province: "Gandaki",
      submitted: "Sep 1, 2026",
      tier: "Academic Standard",
      status: "Pending",
    },
    {
      id: "app-3",
      institution: "Janata Secondary School",
      province: "Koshi",
      submitted: "Aug 30, 2026",
      tier: "Basic Campus",
      status: "Verified",
    },
    {
      id: "app-4",
      institution: "Lumbini Public School",
      province: "Lumbini",
      submitted: "Aug 29, 2026",
      tier: "Academic Standard",
      status: "Pending",
    },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2 border border-border bg-card shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
            Pending Institution Onboarding
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            17 institutions awaiting administrative approval & workspace provisioning
          </CardDescription>
        </div>
        <button
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          aria-label="View all pending approvals"
        >
          <span>View Queue</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse" aria-label="Pending approvals queue">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground border-b border-border/60">
              <th className="py-2.5 px-4 font-medium uppercase tracking-wider text-[11px]">Institution</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Province</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Tier</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Submitted</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-2.5 px-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {approvals.map((approval) => (
              <tr key={approval.id} className="hover:bg-accent/30 transition-colors group">
                <td className="py-3 px-4 font-medium text-foreground">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {approval.institution}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">ID: {approval.id}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-muted-foreground">{approval.province}</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center rounded-xs bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {approval.tier}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-muted-foreground">{approval.submitted}</td>
                <td className="py-3 px-3">
                  {approval.status === "Pending" ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40 gap-1 text-[11px] font-medium"
                    >
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40 gap-1 text-[11px] font-medium"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors font-medium px-2.5"
                  >
                    Review Application
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
