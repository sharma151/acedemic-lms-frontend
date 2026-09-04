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
