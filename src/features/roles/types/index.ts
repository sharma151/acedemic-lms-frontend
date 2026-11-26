export interface RolePermissionDto {
  action: string;
  subject: string;
  conditions?: Record<string, any> | null;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  usersCount?: number;
}

export interface PermissionDefinition {
  id?: string;
  code: string;
  action: string;
  subject: string;
  name: string;
  description: string;
  module: string;
}

export type PermissionItem = string | RolePermissionDto;

export interface RolePermissionsResponse {
  permissions: RolePermissionDto[];
  roleId?: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface AssignPermissionsPayload {
  permissions: RolePermissionDto[];
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetRolesResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: Role[];
  metadata?: {
    totalData?: number;
    totalPage?: number;
    currentPage?: number;
    perPage?: number;
    nextPage?: number | null;
    previousPage?: number | null;
  };
}
