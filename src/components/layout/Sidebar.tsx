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
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 w-full"
                          />
                        }
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "transition-colors h-auto py-2 px-3 hover:bg-secondary/80",
                          isActive &&
                            "bg-secondary text-secondary-foreground font-medium",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
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
