import { apiClient } from "@/lib/api-client";
import {
  AuditLogQueryParams,
  AuditLogResponse,
  FilterOptionsResponse,
  SingleAuditLogResponse,
} from "../schemas";

export const fetchAuditLogs = async (
  params: AuditLogQueryParams
): Promise<AuditLogResponse> => {
  const { data } = await apiClient.get<AuditLogResponse>("/audit-logs", {
    params,
  });
  return data;
};

export const fetchAuditLogFilterOptions = async (): Promise<FilterOptionsResponse> => {
  const { data } = await apiClient.get<FilterOptionsResponse>(
    "/audit-logs/filter-options"
  );
  return data;
};

export const fetchAuditLogById = async (
  id: string
): Promise<SingleAuditLogResponse> => {
  const { data } = await apiClient.get<SingleAuditLogResponse>(
    `/audit-logs/${id}`
  );
  return data;
};
