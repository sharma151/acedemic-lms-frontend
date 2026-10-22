"use client";

import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ArrowUpRight } from "lucide-react";
import { useEnrollmentTrends } from "../api/dashboard";

const DEFAULT_FALLBACK_CHART_DATA = [
  { month: "Apr", fullLabel: "Apr 2026", newEnrollments: 40, upgrades: 18 },
  { month: "May", fullLabel: "May 2026", newEnrollments: 28, upgrades: 14 },
  { month: "Jun", fullLabel: "Jun 2026", newEnrollments: 65, upgrades: 82 },
  { month: "Jul", fullLabel: "Jul 2026", newEnrollments: 55, upgrades: 34 },
  { month: "Aug", fullLabel: "Aug 2026", newEnrollments: 72, upgrades: 29 },
  { month: "Sep", fullLabel: "Sep 2026", newEnrollments: 61, upgrades: 45 },
];

const chartConfig = {
  newEnrollments: {
    label: "New Enrollments",
    color: "var(--color-primary)",
  },
  upgrades: {
    label: "Upgrades / Promotions",
    color: "var(--color-chart-4)",
  },
} satisfies ChartConfig;

export function EnrollmentChart() {
  const { data: trendsData, isLoading } = useEnrollmentTrends({ months: 6 });

  const chartData = useMemo(() => {
    if (trendsData?.trends && Array.isArray(trendsData.trends) && trendsData.trends.length > 0) {
      return trendsData.trends.map((t) => ({
        month: t.label ? t.label.split(" ")[0] : "—",
        fullLabel: t.label || "",
        newEnrollments: Number(t.newEnrollments ?? 0),
        upgrades: Number(t.upgrades ?? (t as any).transfers ?? 0),
        total: Number(t.total ?? 0),
      }));
    }
    return DEFAULT_FALLBACK_CHART_DATA;
  }, [trendsData]);

  const academicYear = trendsData?.academicYear || "2025-2026";
  const tenantName = trendsData?.tenantName;

  return (
    <Card className="col-span-1 lg:col-span-2 border border-border bg-card shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
            Academic Enrollment Dynamics
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Monthly matriculation vs. upgrades and promotion trends
          </CardDescription>
        </div>
        <button
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="View complete enrollment report"
        >
          <span>Detailed Report</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="pt-4 pb-4">
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" strokeDasharray="2 2" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="newEnrollments"
              fill="var(--color-primary)"
              radius={[3, 3, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="upgrades"
              fill="var(--color-chart-4)"
              radius={[3, 3, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-primary" />
              <span className="font-medium text-foreground">New Enrollments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-xs bg-chart-4" />
              <span className="font-medium text-foreground">Upgrades / Promotions</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            {tenantName ? `${tenantName} · ` : ""}Session: {academicYear}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
