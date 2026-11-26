"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  KeyRound,
  Pencil,
  Trash2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useFormatDate } from "@/hooks/use-format-date";
import { Role } from "../types";

interface RolesTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
}

export function RolesTable({
  roles,
  isLoading,
  onEdit,
  onDelete,
  onManagePermissions,
}: RolesTableProps) {
  const { formatDate } = useFormatDate();

  const columns: ColumnDef<Role>[] = [
    {
      header: "S.N.",
      className: "w-16 font-medium text-muted-foreground",
      cell: (_, index) => index + 1,
    },
    {
      header: "Role Name",
      accessorKey: "name",
      className: "font-semibold text-foreground",
      cell: (role) => (
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-md ${
              role.isSystem
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {role.isSystem ? (
              <ShieldAlert className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight text-foreground">
              {role.name}
            </span>
            {role.isSystem && (
              <span className="text-[11px] text-muted-foreground font-normal">
                System Role
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (role) => (
        <span className="text-sm text-muted-foreground line-clamp-1 max-w-md">
          {role.description || "—"}
        </span>
      ),
    },
    {
      header: "Type",
      cell: (role) => (
        <Badge
          variant="outline"
          className={
            role.isSystem
              ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-900/20 dark:text-purple-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
          }
        >
          {role.isSystem ? "System" : "Custom"}
        </Badge>
      ),
    },
    {
      header: "Created Date",
      cell: (role) => (
        <span className="text-xs text-muted-foreground">
          {role.createdAt ? formatDate(role.createdAt) : "—"}
        </span>
      ),
    },
    {
      header: <span className="sr-only">Actions</span>,
      className: "w-16 text-right",
      cell: (role) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onManagePermissions(role)}
                className="cursor-pointer"
              >
                <KeyRound className="mr-2 h-4 w-4 text-primary" />
                Permissions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(role)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              {!role.isSystem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(role)}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Role
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={roles}
      isLoading={isLoading}
      emptyMessage="No roles found. Create your first custom role to get started."
    />
  );
}
