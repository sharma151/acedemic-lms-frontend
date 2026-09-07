import React from "react";
import { Role } from "@/configs/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Building, ShieldCheck, FileDown } from "lucide-react";

export function QuickActions({ role }: { role: string }) {
  const actions = [
    {
      title: "Add new user",
      icon: UserPlus,
      color: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      visible: true,
    },
    {
      title: "Register institution",
      icon: Building,
      color: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      visible: role === Role.SUPER_ADMIN,
    },
    {
      title: "Manage roles",
      icon: ShieldCheck,
      color: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      visible: true,
    },
    {
      title: "Export reports",
      icon: FileDown,
      color: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      visible: true,
    },
  ];

  return (
    <Card className="col-span-1 shadow-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {actions
            .filter((a) => a.visible)
            .map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-4 rounded-md border border-border p-3 text-sm font-medium hover:bg-muted transition-colors text-left"
              >
                <div className={`p-2 rounded-md ${action.bg}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                {action.title}
              </button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
