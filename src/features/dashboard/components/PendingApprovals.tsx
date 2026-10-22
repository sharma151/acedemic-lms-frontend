"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { usePendingInstitutions } from "../api/dashboard";
import { useFormatDate } from "@/hooks/use-format-date";

export function PendingApprovals() {
  const router = useRouter();
  const { formatDate } = useFormatDate();
  const { data: pendingResponse, isLoading } = usePendingInstitutions({ page: 1, limit: 10 });

  const pendingList = useMemo(() => {
    return Array.isArray(pendingResponse?.data) ? pendingResponse.data : [];
  }, [pendingResponse?.data]);

  const totalCount = pendingResponse?.metadata?.totalData ?? pendingList.length;

  return (
    <Card className="col-span-1 lg:col-span-2 border border-border bg-card shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
            Pending Institution Onboarding
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {totalCount} {totalCount === 1 ? "institution" : "institutions"} awaiting administrative approval &amp; workspace provisioning
          </CardDescription>
        </div>
        <button
          onClick={() => router.push("/super-admin/tenants")}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
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
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Admin Contact</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Plan / Tier</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Submitted</th>
              <th className="py-2.5 px-3 font-medium uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-2.5 px-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Loading onboarding requests...</span>
                  </div>
                </td>
              </tr>
            ) : pendingList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-medium text-foreground">All onboarding requests approved</span>
                    <span className="text-[11px] text-muted-foreground">No institutions are currently waiting in pending queue.</span>
                  </div>
                </td>
              </tr>
            ) : (
              pendingList.map((institution) => {
                const adminName = institution.admin
                  ? `${institution.admin.firstName || ""} ${institution.admin.lastName || ""}`.trim()
                  : "—";
                const adminEmail = institution.admin?.email;
                const planName = institution.subscription?.planName || "Free";
                const submittedDate = institution.createdAt
                  ? formatDate(institution.createdAt, "DEFAULT")
                  : "—";
                const isPending =
                  String(institution.status || "").toLowerCase() === "pending";

                return (
                  <tr key={institution.id} className="hover:bg-accent/30 transition-colors group">
                    <td className="py-3 px-4 font-medium text-foreground">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {institution.name}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          ID: {institution.slug || institution.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-muted-foreground">
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium">{adminName}</span>
                        {adminEmail && (
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {adminEmail}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center rounded-xs bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {planName}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-muted-foreground">{submittedDate}</td>

                    <td className="py-3 px-3">
                      {isPending ? (
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
                          {institution.status || "Active"}
                        </Badge>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/super-admin/tenants/${institution.id}`)}
                        className="h-7 text-xs border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors font-medium px-2.5 cursor-pointer"
                      >
                        Review Application
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
