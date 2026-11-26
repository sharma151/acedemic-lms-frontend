import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import {
  Role,
  GetRolesParams,
  GetRolesResponse,
  CreateRolePayload,
  UpdateRolePayload,
  AssignPermissionsPayload,
  RolePermissionsResponse,
} from "../types";

/**
 * Normalizes backend response to extract entity array or item.
 */
function unwrapResponse<T>(res: { data: any }): T {
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) {
    return body.data as T;
  }
  return body as T;
}

// 1. List all roles for the tenant
// GET /api/v1/roles
export const getRoles = async (
  params?: GetRolesParams,
): Promise<{ data: Role[]; metadata?: GetRolesResponse["metadata"] }> => {
  const response = await apiClient.get<any>("/roles", { params });
  const rawData = response.data;

  let roles: Role[] = [];
  let metadata: GetRolesResponse["metadata"] = undefined;

  if (Array.isArray(rawData)) {
    roles = rawData;
  } else if (rawData && typeof rawData === "object") {
    if (Array.isArray(rawData.data)) {
      roles = rawData.data;
      metadata = rawData.metadata;
    } else if (rawData.roles && Array.isArray(rawData.roles)) {
      roles = rawData.roles;
    } else {
      // In case backend returns an object map of roles
      roles = Object.values(rawData).filter(
        (item) => typeof item === "object" && item !== null && "id" in item,
      ) as Role[];
    }
  }

  return { data: roles, metadata };
};

// 2. Get a role by ID
// GET /api/v1/roles/{id}
export const getRoleById = async (id: string): Promise<Role> => {
  const response = await apiClient.get<any>(`/roles/${id}`);
  return unwrapResponse<Role>(response);
};

// 3. Create a new custom role
// POST /api/v1/roles
export const createRoleApi = async (data: CreateRolePayload): Promise<Role> => {
  const response = await apiClient.post<any>("/roles", data);
  return unwrapResponse<Role>(response);
};

// 4. Update a role
// PATCH /api/v1/roles/{id}
export const updateRoleApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateRolePayload;
}): Promise<Role> => {
  const response = await apiClient.patch<any>(`/roles/${id}`, data);
  return unwrapResponse<Role>(response);
};

// 5. Delete a role
// DELETE /api/v1/roles/{id}
export const deleteRoleApi = async (id: string): Promise<unknown> => {
  const response = await apiClient.delete<any>(`/roles/${id}`);
  return response.data;
};

// 6. Get permissions for a role
// GET /api/v1/roles/{id}/permissions
export const getRolePermissions = async (
  id: string,
): Promise<{ permissions: string[]; raw?: any }> => {
  const response = await apiClient.get<any>(`/roles/${id}/permissions`);
  const data = unwrapResponse<any>(response);

  let permissionCodes: string[] = [];

  const rawList = Array.isArray(data)
    ? data
    : data && typeof data === "object"
    ? data.permissions || data.items || []
    : [];

  if (Array.isArray(rawList)) {
    permissionCodes = rawList
      .map((item) => {
        if (typeof item === "string") return item;
        if (item.action && item.subject) {
          return `${item.action}:${item.subject}`;
        }
        return item.code || item.name || item.id || "";
      })
      .filter(Boolean);
  }

  return { permissions: permissionCodes, raw: data };
};

// 7. Assign permissions to a role (Overwrites existing)
// POST /api/v1/roles/{id}/permissions
export const assignRolePermissionsApi = async ({
  roleId,
  permissions,
}: {
  roleId: string;
  permissions: Array<string | { action: string; subject: string; conditions?: any }>;
}): Promise<unknown> => {
  // Format each permission into the backend CASL RolePermissionDto: { action: string, subject: string, conditions?: any }
  const formattedPermissions = permissions.map((p) => {
    if (typeof p === "object" && p !== null && "action" in p && "subject" in p) {
      return {
        action: p.action,
        subject: p.subject,
        ...(p.conditions !== undefined ? { conditions: p.conditions } : {}),
      };
    }
    if (typeof p === "string" && p.includes(":")) {
      const [action, subject] = p.split(":");
      return {
        action,
        subject,
      };
    }
    return p;
  });

  const payload = {
    permissions: formattedPermissions,
  };
  const response = await apiClient.post(`/roles/${roleId}/permissions`, payload);
  return response.data;
};

// --- React Query Hooks ---

export const useGetRoles = (params?: GetRolesParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLES, params],
    queryFn: () => getRoles(params),
  });
};

export const useGetRole = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLE_DETAILS, id],
    queryFn: () => getRoleById(id as string),
    enabled: !!id,
  });
};

export const useGetRolePermissions = (
  roleId?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLE_PERMISSIONS, roleId],
    queryFn: () => getRolePermissions(roleId as string),
    enabled: options?.enabled !== undefined ? options.enabled : !!roleId,
  });
};

export const useCreateRole = () => {
  return useCustomMutation<CreateRolePayload, Role>({
    queryKey: [[QUERY_KEYS.ROLES]],
    service: createRoleApi,
    successTitle: "Role Created",
    successMessage: "Role created successfully!",
  });
};

export const useUpdateRole = () => {
  return useCustomMutation<{ id: string; data: UpdateRolePayload }, Role>({
    queryKey: [[QUERY_KEYS.ROLES], [QUERY_KEYS.ROLE_DETAILS]],
    service: updateRoleApi,
    successTitle: "Role Updated",
    successMessage: "Role updated successfully!",
  });
};

export const useDeleteRole = () => {
  return useCustomMutation<string, unknown>({
    queryKey: [[QUERY_KEYS.ROLES]],
    service: deleteRoleApi,
    successTitle: "Role Deleted",
    successMessage: "Role deleted successfully!",
  });
};

export const useAssignRolePermissions = () => {
  return useCustomMutation<
    { roleId: string; permissions: any[] },
    unknown
  >({
    queryKey: [[QUERY_KEYS.ROLE_PERMISSIONS], [QUERY_KEYS.ROLES]],
    service: assignRolePermissionsApi,
    successTitle: "Permissions Assigned",
    successMessage: "Role permissions updated successfully!",
  });
};
