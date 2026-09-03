"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Apr", new: 400, transfer: 0 },
  { month: "May", new: 450, transfer: 0 },
  { month: "Jun", new: 0, transfer: 300 },
  { month: "Jul", new: 550, transfer: 0 },
  { month: "Aug", new: 700, transfer: 0 },
  { month: "Sep", new: 0, transfer: 500 },
];

const chartConfig = {
  new: {
    label: "New enrollments",
    color: "hsl(var(--primary))",
  },
  transfer: {
    label: "Transfers",
    color: "hsl(var(--chart-4))", // Usually an orange/amber color in shadcn default
  },
} satisfies ChartConfig;

export function EnrollmentChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-border flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Enrollment Trend
        </CardTitle>
        <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
          View report
        </span>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="new"
              fill="var(--color-new)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="transfer"
              fill="var(--color-transfer)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
        <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground ml-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
            <span>New enrollments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[hsl(var(--chart-4))] rounded-sm" />
            <span>Transfers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
