"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
}

interface SidebarProps {
  items: SidebarNavItem[];
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  // Group items by section
  const sections = items.reduce(
    (acc, item) => {
      const section = item.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, SidebarNavItem[]>,
  );

  return (
    <ShadcnSidebar collapsible="icon" className="border-r border-border bg-sidebar text-sidebar-foreground">
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-18 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs hover:text-foreground hover:border-primary/50 transition-colors md:flex"
        aria-label="Toggle sidebar collapse"
      >
        {state === "expanded" ? (
          <ChevronLeft className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>

      <SidebarHeader className="flex h-14 shrink-0 items-center justify-start px-4 border-b border-border/80">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-base text-foreground tracking-tight overflow-hidden"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden font-heading text-sm font-semibold tracking-tight">
            Academic LMS
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-3 px-2 space-y-4">
        {Object.entries(sections).map(([section, sectionItems]) => (
          <SidebarGroup key={section} className="p-0">
            <SidebarGroupLabel className="px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {sectionItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href} className="mb-0.5">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "relative transition-all h-8 py-1.5 px-2.5 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                          "group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-0",
                          isActive &&
                            "bg-accent/80 text-primary font-semibold shadow-2xs before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r-sm before:bg-primary",
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5 w-full group-data-[collapsible=icon]:justify-center"
                        >
                          <item.icon
                            className={cn(
                              "shrink-0 transition-transform",
                              isActive ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground",
                            )}
                          />
                          <span className="group-data-[collapsible=icon]:hidden truncate">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </ShadcnSidebar>
  );
}
