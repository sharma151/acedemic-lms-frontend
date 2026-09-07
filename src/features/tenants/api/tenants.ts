// No React Query hooks in this file
import { apiClient } from "@/lib/api-client";
import { SuccessResponseInterface } from "@/types/api";
import { TENANT_STATUS } from "@/configs/constants";

// --- Types ---

export interface TenantData {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive" | string;
  isolationMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  totalPage: number;
  totalData: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface CreateTenantPayload {
  name: string;
  adminEmail: string;
}

export interface GetTenantsFilters {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
}

// --- API Functions ---

export const createTenantApi = async (
  data: CreateTenantPayload,
): Promise<SuccessResponseInterface<TenantData>> => {
  const response = await apiClient.post("/tenants", data);
  return response.data;
};

export const getTenants = async (
  filters: GetTenantsFilters = {},
): Promise<SuccessResponseInterface<TenantData[]>> => {
  const { page = 1, limit = 10, name, status } = filters;

  // Construct the payload body for filters
  const dataPayload: {
    page: number;
    limit: number;
    name?: string;
    status?: string;
  } = { page, limit };

  if (name && name.trim() !== "") {
    dataPayload.name = name;
  }

  if (status && status !== TENANT_STATUS.ALL && status !== "all") {
    dataPayload.status = status;
  }

  // Pass filters in the `params` config for the GET request
  const response = await apiClient.get("/tenants", { params: dataPayload });
  return response.data;
};

export const activateTenantApi = async (id: string): Promise<SuccessResponseInterface<TenantData>> => {
  const response = await apiClient.post(`/tenants/${id}/activate`);
  return response.data;
};

export const suspendTenantApi = async (id: string): Promise<SuccessResponseInterface<TenantData>> => {
  const response = await apiClient.post(`/tenants/${id}/suspend`);
  return response.data;
};

export interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  role: string;
  createdAt: string;
}

export interface DetailedTenantData extends TenantData {
  databaseUrl: string | null;
  users: {
    institutionAdmins: TenantUser[];
    teachers: TenantUser[];
    students: TenantUser[];
    parents: TenantUser[];
    accountants: TenantUser[];
  };
}

export const getTenantById = async (
  id: string,
): Promise<SuccessResponseInterface<DetailedTenantData>> => {
  const response = await apiClient.get(`/tenants/${id}`);
  return response.data;
};
