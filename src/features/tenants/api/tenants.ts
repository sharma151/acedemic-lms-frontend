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
  slug?: string;
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
  const { page = 1, limit = 10, slug, status } = filters;

  // Construct the payload body for filters
  const dataPayload: {
    page: number;
    limit: number;
    slug?: string;
    status?: string;
  } = { page, limit };

  if (slug && slug.trim() !== "") {
    dataPayload.slug = slug;
  }

  if (status && status !== TENANT_STATUS.ALL) {
    dataPayload.status = status;
  } else if (status === TENANT_STATUS.ALL) {
    dataPayload.status = "";
  }

  // Pass filters in the `data` config for the GET request as requested
  const response = await apiClient.get("/tenants", { data: dataPayload });
  return response.data;
};
