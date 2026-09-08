"use client";

import React from "react";
import { Role } from "@/configs/constants";
import {
  Bell,
  Mail,
  User,
  ChevronDown,
  KeyRound,
  LogOut,
  User as UserIcon,
  Shield,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { logoutApi } from "@/features/auth/api/auth";

import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { useGetProfile } from "@/features/profile/api/get-profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";

interface TopNavbarProps {
  title?: string;
}

export function TopNavbar({ title = "Academic LMS" }: TopNavbarProps) {
  const router = useRouter();
  const user = useSession((state) => state.user);
  const clearSession = useSession((state) => state.clearSession);
  const queryClient = useQueryClient();
  const { data: profileResponse } = useGetProfile();

  const { mutate: logout, isPending: isLoggingOut } = useCustomMutation({
    service: logoutApi,
    successMessage: "Successfully signed out",
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  const handleLogout = () => {
    logout(undefined);
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.name || "Academic User";

  const isSuperAdmin =
    user?.role === Role.SUPER_ADMIN || user?.role === "super-admin";
  const profile = profileResponse?.data;
  const displayTitle =
    !isSuperAdmin && profile?.tenant?.name ? profile.tenant.name : title;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/80 bg-background/95 backdrop-blur-md px-4 sm:px-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 md:hidden text-muted-foreground hover:text-foreground" />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-foreground hidden sm:inline-flex items-center gap-1.5 font-heading">
            {!isSuperAdmin && <Building2 className="h-4 w-4 text-primary" />}
            {displayTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/60"
          aria-label="Messages"
        >
          <Mail className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/60"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2.5 hover:bg-accent/60 px-2 py-1 h-auto rounded-md"
            >
              <div className="h-7 w-7 rounded-md bg-accent text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="items-center gap-1 hidden sm:flex">
                <span className="text-xs font-medium text-foreground">
                  {displayName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 p-0 border-border bg-popover shadow-md">
            <div className="flex items-center gap-3 p-3 bg-muted/40 border-b border-border/60">
              <div className="h-8 w-8 rounded-md bg-accent text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {displayName}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground truncate uppercase flex items-center gap-1">
                  <Shield className="h-3 w-3 text-primary" />
                  {user?.role || (isSuperAdmin ? "Super Admin" : "Tenant Admin")}
                </span>
              </div>
            </div>

            <div className="p-1 space-y-0.5">
              <DropdownMenuItem
                className="cursor-pointer py-1.5 px-2.5 text-xs text-foreground hover:bg-accent focus:bg-accent"
                onClick={() => {
                  router.push(isSuperAdmin ? "/super-admin/profile" : "/profile");
                }}
              >
                <UserIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span>Personal Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer py-1.5 px-2.5 text-xs text-foreground hover:bg-accent focus:bg-accent">
                <KeyRound className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <span>Security Credentials</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-0 bg-border/60" />

            <div className="p-1">
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer py-1.5 px-2.5 text-xs text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
              </DropdownMenuItem>
            </div>

            <div className="px-3 py-1.5 bg-muted/20 border-t border-border/40 text-center">
              <span className="text-[10px] font-mono text-muted-foreground">
                LMS Platform Core v2.4
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
