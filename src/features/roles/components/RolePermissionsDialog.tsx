"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, KeyRound, Search, CheckCheck } from "lucide-react";
import { SYSTEM_PERMISSION_MODULES } from "../schemas/roleSchemas";
import { useGetRolePermissions, useAssignRolePermissions } from "../api/roles";
import { Role } from "../types";

interface RolePermissionsDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolePermissionsDialog({
  role,
  open,
  onOpenChange,
}: RolePermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rolePermissionsData, isLoading: isLoadingPermissions } =
    useGetRolePermissions(role?.id, {
      enabled: open && !!role?.id,
    });

  const assignMutation = useAssignRolePermissions();

  // Sync loaded permissions into state
  useEffect(() => {
    if (open && rolePermissionsData?.permissions) {
      setSelectedPermissions(new Set(rolePermissionsData.permissions));
    } else if (open) {
      setSelectedPermissions(new Set());
    }
    setSearchQuery("");
  }, [open, rolePermissionsData]);

  const allAvailablePermissions = useMemo(() => {
    return SYSTEM_PERMISSION_MODULES.flatMap((mod) =>
      mod.permissions.map((p) => ({
        ...p,
        module: mod.module,
      })),
    );
  }, []);

  const totalCount = allAvailablePermissions.length;
  const grantedCount = selectedPermissions.size;

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const toggleModulePermissions = (moduleName: string) => {
    const module = SYSTEM_PERMISSION_MODULES.find((m) => m.module === moduleName);
    if (!module) return;

    const moduleCodes = module.permissions.map((p) => p.code);
    const areAllSelected = moduleCodes.every((code) => selectedPermissions.has(code));

    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (areAllSelected) {
        moduleCodes.forEach((code) => next.delete(code));
      } else {
        moduleCodes.forEach((code) => next.add(code));
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allSelected = totalCount === grantedCount;
    if (allSelected) {
      setSelectedPermissions(new Set());
    } else {
      setSelectedPermissions(new Set(allAvailablePermissions.map((p) => p.code)));
    }
  };

  const handleSave = () => {
    if (!role) return;
    const permissionsPayload = Array.from(selectedPermissions).map((code) => {
      const [action, subject] = code.split(":");
      return { action, subject };
    });

    assignMutation.mutate(
      {
        roleId: role.id,
        permissions: permissionsPayload,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  // Filter modules based on search
  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return SYSTEM_PERMISSION_MODULES;

    return SYSTEM_PERMISSION_MODULES.map((mod) => {
      const filteredPermissions = mod.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.code.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          mod.module.toLowerCase().includes(query),
      );
      return {
        ...mod,
        permissions: filteredPermissions,
      };
    }).filter((mod) => mod.permissions.length > 0);
  }, [searchQuery]);

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                  Permissions: <span className="text-primary">{role.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Configure granular capability access for this role.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2.5 py-1 text-xs font-mono font-medium">
                {grantedCount} of {totalCount} granted
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs h-8"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1 text-primary" />
                {grantedCount === totalCount ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions or modules..."
              className="pl-9 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>

        {/* Permissions Matrix List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingPermissions ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm">Loading assigned permissions...</span>
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No permissions found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredModules.map((mod) => {
              const moduleCodes = mod.permissions.map((p) => p.code);
              const moduleGranted = moduleCodes.filter((code) =>
                selectedPermissions.has(code),
              ).length;
              const allModuleSelected =
                moduleCodes.length > 0 && moduleGranted === moduleCodes.length;

              return (
                <div
                  key={mod.module}
                  className="rounded-lg border border-border/80 bg-card overflow-hidden shadow-2xs"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border/60">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {mod.module}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {mod.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 hover:bg-background"
                      onClick={() => toggleModulePermissions(mod.module)}
                    >
                      {allModuleSelected ? "Uncheck Module" : "Check Module"} (
                      {moduleGranted}/{moduleCodes.length})
                    </Button>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mod.permissions.map((perm) => {
                      const isChecked = selectedPermissions.has(perm.code);
                      return (
                        <div
                          key={perm.code}
                          onClick={() => togglePermission(perm.code)}
                          className={`flex items-start justify-between gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                            isChecked
                              ? "border-primary/40 bg-primary/5 dark:bg-primary/10"
                              : "border-border/60 hover:bg-accent/40"
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium leading-none text-foreground">
                                {perm.name}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {perm.description}
                            </p>
                            <span className="text-[11px] font-mono text-muted-foreground/80 block">
                              {perm.code}
                            </span>
                          </div>
                          <Switch
                            checked={isChecked}
                            onCheckedChange={() => togglePermission(perm.code)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-0.5"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="p-4 px-6 border-t border-border/80 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={assignMutation.isPending || isLoadingPermissions}
          >
            {assignMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
