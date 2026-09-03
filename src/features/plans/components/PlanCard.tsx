import React from "react";
import { SubscriptionPlan } from "../types";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: "monthly" | "yearly";
  isSelected: boolean;
  onClick: () => void;
}

export function PlanCard({
  plan,
  billingCycle,
  isSelected,
  onClick,
}: PlanCardProps) {
  const isEnterprise = plan.slug === "enterprise";
  const price =
    billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

  const featureLabels: Record<keyof SubscriptionPlan["features"], string> = {
    hostel: "Hostel Management",
    grading: "Grading System",
    library: "Library Management",
    reports: "Standard Reports",
    apiAccess: "API Access",
    timetable: "Timetable Module",
    transport: "Transport Management",
    attendance: "Attendance Tracking",
    parentPortal: "Parent Portal",
    customReports: "Custom Reports",
    onlineClasses: "Online Classes",
    examManagement: "Exam Management",
    smsNotifications: "SMS Notifications",
    emailNotifications: "Email Notifications",
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative flex flex-col transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-1 hover:shadow-xl",
        isEnterprise
          ? "border-blue-500 shadow-lg dark:border-blue-500/50"
          : "border-slate-200 dark:border-slate-800",
        isSelected &&
          "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950 border-blue-500 bg-slate-50 dark:bg-slate-900/50"
      )}
    >
      {isEnterprise && (
        <div className="absolute top-0 right-0 left-0 bg-blue-500 text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <CardHeader className={cn("pb-4", isEnterprise ? "pt-10" : "")}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          {isSelected && (
            <Badge variant="default" className="bg-blue-500">
              Selected
            </Badge>
          )}
        </div>
        <CardDescription className="min-h-[40px] text-sm mt-2">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-6">
        <div className="mb-6 flex items-baseline text-slate-900 dark:text-white">
          <span className="text-4xl font-extrabold tracking-tight">
            ${price}
          </span>
          <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            /{billingCycle === "monthly" ? "month" : "year"}
          </span>
        </div>

        <ul className="space-y-3 text-sm">
          {Object.entries(plan.features).map(([key, value]) => (
            <li key={key} className="flex items-center">
              {value ? (
                <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <X className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                </div>
              )}
              <span
                className={
                  value
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-slate-400 dark:text-slate-500 line-through"
                }
              >
                {featureLabels[key as keyof SubscriptionPlan["features"]]}
              </span>
            </li>
          ))}
          <li className="flex items-center">
            <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {plan.maxStudents ? `Up to ${plan.maxStudents} Students` : "Unlimited Students"}
            </span>
          </li>
          <li className="flex items-center">
            <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {plan.maxTeachers ? `Up to ${plan.maxTeachers} Teachers` : "Unlimited Teachers"}
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={cn(
            "w-full transition-all font-semibold",
            isEnterprise
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          )}
          variant="default"
        >
          {isSelected ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
