import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useQueryParam } from "@/hooks/use-query-params";
import { getTenants, PaginationMetadata } from "../api/tenants";
import { QUERY_KEYS } from "@/configs/querykey";

export function useTenantsList() {
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("name") || "";
  const status = searchParams.get("status") || "all";

  const { data: response, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TENANTS, currentPage, pageSize, name, status],
    queryFn: () =>
      getTenants({
        page: currentPage,
        limit: pageSize,
        name,
        status: status === "all" ? undefined : status,
      }),
  });

  const tenants = response?.data || [];
  const metadata = response?.metadata as PaginationMetadata | undefined;

  return {
    tenants,
    metadata,
    isLoading,
    filters: {
      currentPage,
      pageSize,
      name,
      status,
    },
    setQueryParams,
  };
}
