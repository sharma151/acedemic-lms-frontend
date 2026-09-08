"use client";

import React from "react";
import { Role } from "@/configs/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Building, ShieldCheck, FileDown, ArrowRight } from "lucide-react";

interface QuickActionsProps {
  role: string;
}

export function QuickActions({ role }: QuickActionsProps) {
  const actions = [
    {
      id: "add-user",
      title: "Provision New User",
      subtitle: "Add student, teacher or staff member",
      icon: UserPlus,
      shortcut: "⌘U",
      visible: true,
    },
    {
      id: "register-institution",
      title: "Register Campus",
      subtitle: "Create new tenant domain & license",
      icon: Building,
      shortcut: "⌘I",
      visible: role === Role.SUPER_ADMIN,
    },
    {
      id: "manage-roles",
      title: "Access Control & Roles",
      subtitle: "Modify permissions and policies",
      icon: ShieldCheck,
      shortcut: "⌘R",
      visible: true,
    },
    {
      id: "export-reports",
      title: "Export Audit Ledger",
      subtitle: "Download CSV/PDF compliance reports",
      icon: FileDown,
      shortcut: "⌘E",
      visible: true,
    },
  ];

  return (
    <Card className="col-span-1 border border-border bg-card shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
          Administrative Actions
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Fast-path utility actions
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-3 pb-4">
        <div className="grid gap-2">
          {actions
            .filter((a) => a.visible)
            .map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="group flex items-center justify-between rounded-md border border-border/80 bg-background/50 p-2.5 text-left text-xs transition-all hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-accent/60 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">{action.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <kbd className="hidden sm:inline-block rounded-xs border border-border bg-muted/50 px-1 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                      {action.shortcut}
                    </kbd>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                  </div>
                </button>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
