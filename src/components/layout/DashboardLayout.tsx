"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { tenantNavigation, adminNavigation } from "./navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
      <Sidebar items={navigation} />
      <SidebarInset className="bg-slate-50 dark:bg-black">
        <TopNavbar title={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
