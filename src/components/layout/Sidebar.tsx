import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, Mountain } from "lucide-react";
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
} from "@/components/ui/sidebar";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
}

interface SidebarProps {
  items: SidebarNavItem[];
  // Optional props for backward compatibility before layout refactor
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
      <SidebarHeader className="flex h-16 shrink-0 items-center justify-center px-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400 overflow-hidden"
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
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "transition-colors",
                          isActive &&
                            "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50",
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
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
