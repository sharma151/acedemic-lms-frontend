"use client";

import { useMemo } from "react";
import { useSession } from "@/lib/session";
import { Role } from "@/configs/constants";
import { useGetRolePermissions } from "@/features/roles/api/roles";

export function usePermissions() {
  const { user } = useSession();

  const isSuperAdmin = useMemo(() => {
    const rawRole = (user?.role || "").toLowerCase();
    return (
      user?.role === Role.SUPER_ADMIN ||
      rawRole === "super-admin" ||
      rawRole === "superadmin" ||
      rawRole === "super admin"
    );
  }, [user?.role]);

  const isInstitutionAdmin = useMemo(() => {
    const rawRole = (user?.role || "").toLowerCase();
    return (
      user?.role === Role.INSTITUTION_ADMIN ||
      rawRole === "institution admin" ||
      rawRole === "institution-admin" ||
      rawRole === "admin"
    );
  }, [user?.role]);

  // Query role permissions when roleId is available and user is not super-admin
  const roleId = (user as any)?.roleId;
  const { data: rolePermissionsData, isLoading } = useGetRolePermissions(
    roleId,
    {
      enabled: !!roleId && !isSuperAdmin,
    },
  );

  const permissions = useMemo(() => {
    return rolePermissionsData?.permissions || [];
  }, [rolePermissionsData]);

  /**
   * Check if user has a specific permission or action & subject
   * e.g. can("read:Class") or can("read", "Class")
   */
  const can = (actionOrCode: string, subject?: string): boolean => {
    if (!user) return false;
    // Super admins always have full platform access
    if (isSuperAdmin) return true;

    // Institution admins retain full control over tenant resources
    if (isInstitutionAdmin) return true;

    const fullCode = subject ? `${actionOrCode}:${subject}` : actionOrCode;
    const [action, itemSubject] = fullCode.includes(":")
      ? fullCode.split(":")
      : [fullCode, ""];

    // Check if permission matches user role directly (backwards compatibility)
    if (
      user.role === fullCode ||
      (Array.isArray((user as any).role) && (user as any).role.includes(fullCode))
    ) {
      return true;
    }

    // CASL rule: "manage:all" grants everything
    if (permissions.includes("manage:all") || permissions.includes("manage:all")) return true;

    // CASL rule: "manage:<Subject>" grants any action on that subject (e.g. manage:Class grants read:Class)
    if (itemSubject && permissions.includes(`manage:${itemSubject}`)) {
      return true;
    }

    // Direct match (e.g. "read:Class")
    return permissions.includes(fullCode);
  };

  /**
   * Check if user has at least one of the specified permissions
   */
  const canAny = (permissionCodes: string[]): boolean => {
    return permissionCodes.some((code) => can(code));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const canAll = (permissionCodes: string[]): boolean => {
    return permissionCodes.every((code) => can(code));
  };

  return {
    permissions,
    can,
    canAny,
    canAll,
    isLoading,
    isSuperAdmin,
    isInstitutionAdmin,
    role: user?.role,
    roleId,
  };
}
