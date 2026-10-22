import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { QUERY_KEYS } from "@/configs/querykey";
import {
  DashboardSummaryData,
  EnrollmentTrendsData,
  PendingInstitutionsResponse,
  GetDashboardSummaryParams,
  GetEnrollmentTrendsParams,
  GetPendingInstitutionsParams,
} from "../types";

// Helper to unwrap standard backend responses: { success, statusCode, message, data, metadata }
function unwrapResponse<T>(res: { data: any }): T {
  const body = res.data;
  if (body && typeof body === "object" && "data" in body) {
    return body.data as T;
  }
  return body as T;
}

// 1. Dashboard Metric Cards Summary
// GET /api/v1/dashboard/summary
export const getDashboardSummary = async (
  params?: GetDashboardSummaryParams
): Promise<DashboardSummaryData> => {
  const res = await apiClient.get<any>("/dashboard/summary", { params });
  return unwrapResponse<DashboardSummaryData>(res);
};

export const useDashboardSummary = (
  params?: GetDashboardSummaryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY, params],
    queryFn: () => getDashboardSummary(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

// 2. 6-Month Enrollment Trends Bar Chart
// GET /api/v1/dashboard/charts/enrollment-trends
export const getEnrollmentTrends = async (
  params?: GetEnrollmentTrendsParams
): Promise<EnrollmentTrendsData> => {
  const res = await apiClient.get<any>("/dashboard/charts/enrollment-trends", { params });
  return unwrapResponse<EnrollmentTrendsData>(res);
};

export const useEnrollmentTrends = (
  params?: GetEnrollmentTrendsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_ENROLLMENT_TRENDS, params],
    queryFn: () => getEnrollmentTrends(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

// 3. Pending Institution Onboardings (Super Admin Only)
// GET /api/v1/dashboard/pending-institutions
export const getPendingInstitutions = async (
  params?: GetPendingInstitutionsParams
): Promise<PendingInstitutionsResponse> => {
  const res = await apiClient.get<any>("/dashboard/pending-institutions", { params });
  const body = res.data;
  return {
    data: Array.isArray(body?.data) ? body.data : [],
    metadata: body?.metadata || {
      totalData: Array.isArray(body?.data) ? body.data.length : 0,
      totalPage: 1,
      perPage: params?.limit || 20,
      currentPage: params?.page || 1,
      nextPage: null,
      previousPage: null,
    },
  };
};

export const usePendingInstitutions = (
  params?: GetPendingInstitutionsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_PENDING_INSTITUTIONS, params],
    queryFn: () => getPendingInstitutions(params),
    staleTime: 60 * 1000,
    ...options,
  });
};
