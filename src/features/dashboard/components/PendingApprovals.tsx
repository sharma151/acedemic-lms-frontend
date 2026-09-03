import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PendingApprovals() {
  const approvals = [
    {
      institution: "Bhaktapur Model School",
      province: "Bagmati",
      submitted: "Sep 2, 2026",
      status: "Pending",
    },
    {
      institution: "Pokhara Valley College",
      province: "Gandaki",
      submitted: "Sep 1, 2026",
      status: "Pending",
    },
    {
      institution: "Janata Secondary School",
      province: "Koshi",
      submitted: "Aug 30, 2026",
      status: "Verified",
    },
    {
      institution: "Lumbini Public School",
      province: "Lumbini",
      submitted: "Aug 29, 2026",
      status: "Pending",
    },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-border flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">
          Pending Institution Approvals
        </CardTitle>
        <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
          View all 17
        </span>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Institution</th>
              <th className="pb-3 font-medium">Province</th>
              <th className="pb-3 font-medium">Submitted</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-4 font-medium text-foreground">
                  {approval.institution}
                </td>
                <td className="py-4 text-muted-foreground">{approval.province}</td>
                <td className="py-4 text-muted-foreground">{approval.submitted}</td>
                <td className="py-4">
                  <Badge
                    variant="outline"
                    className={
                      approval.status === "Pending"
                        ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50"
                        : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50"
                    }
                  >
                    {approval.status}
                  </Badge>
                </td>
                <td className="py-4 text-right">
                  <Button variant="secondary" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                    Review
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
