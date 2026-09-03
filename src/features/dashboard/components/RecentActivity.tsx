import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  const activities = [
    {
      user: "Rohan Shrestha",
      action: "approved 2 new teacher accounts at PKR_PPSU",
      time: "18 minutes ago",
      dotColor: "bg-orange-700/80",
    },
    {
      user: "Anjali Gurung",
      action: "submitted enrollment data for BTL_PPSU",
      time: "1 hour ago",
      dotColor: "bg-slate-700",
    },
    {
      user: "New institution Bhaktapur Model School",
      action: "registered",
      time: "3 hours ago",
      dotColor: "bg-teal-500",
    },
    {
      user: "Sunita Thapa",
      action: "updated role permissions for KTM_PPSU",
      time: "Yesterday, 4:20 PM",
      dotColor: "bg-orange-700/80",
    },
  ];

  return (
    <Card className="col-span-1 shadow-sm border-border flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
          View all
        </span>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-6">
          {activities.map((activity, i) => (
            <li key={i} className="flex gap-3">
              <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${activity.dotColor}`} />
              <div className="flex flex-col text-sm">
                <p className="text-foreground leading-snug">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <span className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
