import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, GraduationCap, Clock, ArrowUp, ArrowDown } from "lucide-react";

export function StatCards({ role }: { role: string }) {
  // Dummy data
  const stats = [
    {
      title: "Total Institutions",
      value: "248",
      trend: "12 this month",
      trendUp: true,
      icon: Building2,
      visible: role === "super-admin",
    },
    {
      title: "Total Students",
      value: "54,320",
      trend: "3.8% vs last term",
      trendUp: true,
      icon: Users,
      visible: true,
    },
    {
      title: "Total Teachers",
      value: "3,912",
      trend: "96 this term",
      trendUp: true,
      icon: GraduationCap,
      visible: true,
    },
    {
      title: "Pending Approvals",
      value: "17",
      trend: "needs review",
      trendUp: false,
      icon: Clock,
      visible: role === "super-admin",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats
        .filter((s) => s.visible)
        .map((stat, i) => (
          <Card key={i} className="shadow-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary/50 dark:bg-secondary/20">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold tracking-tight mt-1">
                  {stat.value}
                </h3>
                <div className="mt-2 flex items-center text-xs">
                  {stat.trendUp ? (
                    <span className="flex items-center text-green-600 dark:text-green-500 font-medium">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      {stat.trend}
                    </span>
                  ) : (
                    <span className="flex items-center text-destructive font-medium">
                      <ArrowDown className="mr-1 h-3 w-3" />
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
