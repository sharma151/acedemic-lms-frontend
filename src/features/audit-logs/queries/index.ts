import { useQuery } from "@tanstack/react-query";
import {
  fetchAuditLogById,
  fetchAuditLogFilterOptions,
  fetchAuditLogs,
} from "../api";
import { AuditLogQueryParams } from "../schemas";

export const auditLogsKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditLogsKeys.all, "list"] as const,
  list: (params: AuditLogQueryParams) =>
    [...auditLogsKeys.lists(), params] as const,
  filterOptions: () => [...auditLogsKeys.all, "filter-options"] as const,
  details: () => [...auditLogsKeys.all, "detail"] as const,
  detail: (id: string) => [...auditLogsKeys.details(), id] as const,
};

export const useAuditLogs = (params: AuditLogQueryParams) => {
  return useQuery({
    queryKey: auditLogsKeys.list(params),
    queryFn: () => fetchAuditLogs(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useAuditLogFilterOptions = () => {
  return useQuery({
    queryKey: auditLogsKeys.filterOptions(),
    queryFn: () => fetchAuditLogFilterOptions(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useAuditLogById = (id: string | null) => {
  return useQuery({
    queryKey: auditLogsKeys.detail(id!),
    queryFn: () => fetchAuditLogById(id!),
    enabled: !!id,
  });
};
