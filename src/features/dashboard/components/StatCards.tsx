"use client";

import React from "react";
import { Role } from "@/configs/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, GraduationCap, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardsProps {
  role: string;
}

export function StatCards({ role }: StatCardsProps) {
  const stats = [
    {
      id: "institutions",
      title: "Active Institutions",
      value: "248",
      trend: "+12 this month",
      trendDirection: "up" as const,
      icon: Building2,
      visible: role === Role.SUPER_ADMIN,
      description: "Chartered & affiliated campuses",
    },
    {
      id: "students",
      title: "Enrolled Students",
      value: "54,320",
      trend: "+3.8% vs last term",
      trendDirection: "up" as const,
      icon: Users,
      visible: true,
      description: "Active academic enrollments",
    },
    {
      id: "faculty",
      title: "Faculty & Staff",
      value: "3,912",
      trend: "+96 this term",
      trendDirection: "up" as const,
      icon: GraduationCap,
      visible: true,
      description: "Instructors & department heads",
    },
    {
      id: "approvals",
      title: "Pending Onboarding",
      value: "17",
      trend: "Requires review",
      trendDirection: "down" as const,
      icon: Clock,
      visible: role === Role.SUPER_ADMIN,
      description: "Institution registration requests",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats
        .filter((s) => s.visible)
        .map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trendDirection === "up";
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
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stat.id === "approvals" ? (
                        <Minus className="h-3 w-3" />
                      ) : isUp ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
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
