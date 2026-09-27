import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { AuditLogItem } from "../schemas";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useAuditLogs } from "../queries";
import { useSearchParams } from "next/navigation";
import { useQueryParam } from "@/hooks/use-query-params";
import { AuditLogDetailSheet } from "./AuditLogDetailSheet";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useFormatDate } from "@/hooks/use-format-date";

export const AuditLogTable: React.FC = () => {
  const { formatDate } = useFormatDate();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("page");

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "20");

  const queryParams = {
    page,
    limit,
    tenantId: searchParams.get("tenantId") || undefined,
    userId: searchParams.get("userId") || undefined,
    action: searchParams.get("action") || undefined,
    entity: searchParams.get("entity") || undefined,
    status: searchParams.get("status") as any || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    search: searchParams.get("search") || undefined,
  };

  const { data, isLoading } = useAuditLogs(queryParams);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const columns: ColumnDef<AuditLogItem>[] = [
    {
      header: "Timestamp",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {formatDate(item.createdAt, "MDY_WITH_TIME")}
          </span>
          <span className="text-xs text-slate-500">
            {dayjs(item.createdAt).fromNow()}
          </span>
        </div>
      ),
    },
    {
      header: "Actor",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.actorName}</span>
          <span className="text-xs text-slate-500">{item.actorEmail}</span>
        </div>
      ),
    },
    {
      header: "Action",
      cell: (item) => (
        <Badge variant="outline" className="font-mono text-xs">
          {item.action}
        </Badge>
      ),
    },
    {
      header: "Entity",
      accessorKey: "entity",
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge
          variant={item.status === "SUCCESS" ? "default" : "destructive"}
          className={
            item.status === "SUCCESS"
              ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
          }
        >
          {item.status} ({item.statusCode})
        </Badge>
      ),
    },
    {
      header: "Duration",
      cell: (item) => (
        <span className="text-slate-600 font-mono text-sm">
          {item.executionDurationMs}ms
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLogId(item.id);
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedLogId(row.id)}
        showPagination
        currentPage={data?.metadata?.currentPage || 1}
        totalPages={data?.metadata?.totalPage || 1}
        totalItems={data?.metadata?.totalData || 0}
        pageSize={data?.metadata?.perPage || 20}
        onPageChange={(p) => setQueryParams({ page: String(p) })}
        onPageSizeChange={(s) => setQueryParams({ limit: String(s), page: "1" })}
      />
      
      <AuditLogDetailSheet
        auditLogId={selectedLogId}
        onClose={() => setSelectedLogId(null)}
      />
    </>
  );
};
