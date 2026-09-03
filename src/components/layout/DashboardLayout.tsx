"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { tenantNavigation, adminNavigation } from "./navigation";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "tenant" | "superadmin";
  title?: string;
}

export function DashboardLayout({
  children,
  role = "tenant",
  title,
}: DashboardLayoutProps) {
  const navigation = role === "superadmin" ? adminNavigation : tenantNavigation;

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black w-full">
        <Sidebar items={navigation} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNavbar title={title} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
