"use client";

import {
  Bell,
  Mail,
  User,
  ChevronDown,
  KeyRound,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { logoutApi } from "@/features/auth/api/auth";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface TopNavbarProps {
  title?: string;
}

import { useQueryClient } from "@tanstack/react-query";

export function TopNavbar({ title = "Academic LMS" }: TopNavbarProps) {
  const router = useRouter();
  const { user, logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useCustomMutation({
    service: logoutApi,
    successMessage: "Successfully logged out",
    onSuccess: () => {
      Cookies.remove("lms_access_token");
      logoutStore();
      queryClient.clear(); // Clear the entire query cache (including the profile data)
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logout(undefined);
  };

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.name || "Admin User";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white dark:bg-slate-950 px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 md:hidden" />
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Mail className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900 px-3 py-2 h-auto"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold overflow-hidden border border-blue-200 dark:border-blue-800">
                <User className="h-4 w-4" />
              </div>
              <div className="items-center gap-1 hidden sm:flex">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {displayName}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-0">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-t-md">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold overflow-hidden border border-blue-200">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 truncate">
                  {displayName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.role || "Super Admin"}
                </span>
                {user?.email && (
                  <span className="text-xs text-slate-400 truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenuSeparator className="m-0" />

            <div className="p-1">
              <DropdownMenuItem className="cursor-pointer py-2 px-3 gap-3">
                <KeyRound className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Change Password
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer py-2 px-3 gap-3"
                onClick={() => {
                  const isSuperAdmin = user?.role === "Super Admin" || user?.role === "super-admin";
                  router.push(isSuperAdmin ? "/super-admin/profile" : "/profile");
                }}
              >
                <UserIcon className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Personal Profile
                </span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="m-0" />

            <div className="p-1">
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer py-2 px-3 gap-3 text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </span>
              </DropdownMenuItem>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 text-center rounded-b-md">
              <span className="text-[10px] text-slate-400">
                Version: 2026.09.02
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
