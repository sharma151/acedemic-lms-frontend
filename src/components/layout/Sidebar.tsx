import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, Mountain, ChevronLeft, ChevronRight } from "lucide-react";
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
    <ShadcnSidebar collapsible="icon">
      <button
        onClick={toggleSidebar}
        className="absolute -right-4 top-18 z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground md:flex"
      >
        {state === "expanded" ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      <SidebarHeader className="flex h-16 shrink-0 items-center justify-center px-4 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary overflow-hidden"
        >
          <Mountain className="w-6 h-6 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            LMS Portal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {Object.entries(sections).map(([section, sectionItems]) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              {section}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sectionItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href} className="mb-1">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "transition-all h-auto py-2.5 px-4 rounded-md text-[15px] text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400",
                          isActive &&
                            "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold shadow-sm",
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon className={cn("shrink-0 transition-transform", isActive ? "h-5 w-5" : "h-[18px] w-[18px]")} />
                          <span>{item.title}</span>
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
