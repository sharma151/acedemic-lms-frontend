"use client";

import React, { useState, useMemo } from "react";
import { Plus, Shield, ShieldCheck, KeyRound, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFilterSearch from "@/hooks/use-filter-search";
import { useGetRoles } from "../api/roles";
import { Role } from "../types";
import { RolesTable } from "./RolesTable";
import { RoleDialog } from "./RoleDialog";
import { DeleteRoleDialog } from "./DeleteRoleDialog";
import { RolePermissionsDialog } from "./RolePermissionsDialog";

export function RolesPageTemplate() {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [roleForPermissions, setRoleForPermissions] = useState<Role | null>(null);

  const { data: rolesResponse, isLoading } = useGetRoles();
  const allRoles: Role[] = rolesResponse?.data || [];

  // Client-side search for fast filtering
  const { renderSearch, debouncedSearch } = useFilterSearch({
    id: "search-roles",
    placeholder: "Search roles by name or description...",
  });

  const filteredRoles = useMemo(() => {
    if (!debouncedSearch) return allRoles;
    const query = debouncedSearch.toLowerCase().trim();
    return allRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        (role.description && role.description.toLowerCase().includes(query)),
    );
  }, [allRoles, debouncedSearch]);

  const stats = useMemo(() => {
    const total = allRoles.length;
    const system = allRoles.filter((r) => r.isSystem).length;
    const custom = total - system;
    return { total, system, custom };
  }, [allRoles]);

  const handleCreateNew = () => {
    setRoleToEdit(null);
    setIsRoleDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setRoleToEdit(role);
    setIsRoleDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
  };

  const handleManagePermissions = (role: Role) => {
    setRoleForPermissions(role);
  };

  return (
    <div className="space-y-6">
      {/* Precision Header Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-primary/10 text-primary border border-primary/20">
              <Shield className="h-3 w-3" />
              RBAC SECURITY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Roles & Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure custom institution roles and enforce granular access control policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button onClick={handleCreateNew} className="shadow-xs font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Roles
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {stats.total}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                System Default Roles
              </p>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                {stats.system}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Lock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Custom Roles
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {stats.custom}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table Area */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-xs">{renderSearch()}</div>
        </div>

        <RolesTable
          roles={filteredRoles}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onManagePermissions={handleManagePermissions}
        />
      </div>

      {/* Dialogs */}
      <RoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        roleToEdit={roleToEdit}
      />

      <DeleteRoleDialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        role={roleToDelete}
      />

      <RolePermissionsDialog
        open={!!roleForPermissions}
        onOpenChange={(open) => !open && setRoleForPermissions(null)}
        role={roleForPermissions}
      />
    </div>
  );
}
