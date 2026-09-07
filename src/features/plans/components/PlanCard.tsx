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
          ? "border-primary shadow-lg dark:border-primary/50"
          : "border-border dark:border-border",
        isSelected &&
          "ring-2 ring-primary ring-offset-2 dark:ring-offset-background border-primary bg-secondary/50 dark:bg-secondary/20"
      )}
    >
      {isEnterprise && (
        <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-xs font-bold text-center py-1 uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <CardHeader className={cn("pb-4", isEnterprise ? "pt-10" : "")}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          {isSelected && (
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Selected
            </Badge>
          )}
        </div>
        <CardDescription className="min-h-[40px] text-sm mt-2 text-muted-foreground">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-6">
        <div className="mb-6 flex items-baseline text-foreground">
          <span className="text-4xl font-extrabold tracking-tight">
            ${price}
          </span>
          <span className="ml-1 text-sm font-medium text-muted-foreground">
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
                <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-muted dark:bg-muted/50">
                  <X className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span
                className={
                  value
                    ? "text-foreground"
                    : "text-muted-foreground line-through"
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
            <span className="text-foreground font-medium">
              {plan.maxStudents ? `Up to ${plan.maxStudents} Students` : "Unlimited Students"}
            </span>
          </li>
          <li className="flex items-center">
            <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-foreground font-medium">
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
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          )}
          variant={isEnterprise ? "default" : "secondary"}
        >
          {isSelected ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
