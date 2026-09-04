import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Settings,
  Building2,
  CreditCard,
} from "lucide-react";
import { SidebarNavItem } from "./Sidebar";

export const tenantNavigation: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "Overview",
  },
  { title: "Users", href: "/users", icon: Users, section: "Management" },
  { title: "Roles", href: "/roles", icon: ShieldAlert, section: "Management" },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    section: "Configuration",
  },
];

export const adminNavigation: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
    section: "Platform Management",
  },
  { title: "Tenants", href: "/super-admin/tenants", icon: Building2, section: "Management" },
  {
    title: "Global Settings",
    href: "/super-admin/settings",
    icon: Settings,
    section: "Configuration",
  },
  {
    title: "Subscription Plans",
    href: "/super-admin/plans",
    icon: CreditCard,
    section: "Platform Management",
  },
];
