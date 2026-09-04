"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFormatDate } from "@/hooks/use-format-date";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getTenants, TenantData, PaginationMetadata } from "../api/tenants";
import { TENANT_STATUS } from "@/configs/constants";
import { AddTenantDialog } from "./AddTenantDialog";

interface TenantsPageTemplateProps {
  title: string;
  description: string;
}

export function TenantsPageTemplate({
  title,
  description,
}: TenantsPageTemplateProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<string>(TENANT_STATUS.ALL);
  const { formatDate } = useFormatDate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["tenants", currentPage, pageSize, slug, status],
    queryFn: () =>
      getTenants({ page: currentPage, limit: pageSize, slug, status }),
  });
  const tenants = response?.data || [];
  const metadata = response?.metadata as PaginationMetadata | undefined;

  const columns: ColumnDef<TenantData>[] = [
    {
      header: "S.N.",
      className: "w-16 font-medium text-slate-500",
      cell: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium text-slate-900 dark:text-slate-100",
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge
          variant="outline"
          className={
            item.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Created At",
      cell: (item) => (
        <span className="text-slate-500">
          {formatDate(item.createdAt, "DEFAULT")}
        </span>
      ),
    },
    {
      header: "Updated At",
      cell: (item) => (
        <span className="text-slate-500">
          {formatDate(item.updatedAt, "DEFAULT")}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <AddTenantDialog>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Add Tenant
          </Button>
        </AddTenantDialog>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 py-2">
        <Input
          placeholder="Filter by slug..."
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TENANT_STATUS).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key === "ALL" ? "All" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={tenants}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No tenants found. Click 'Add Tenant' to create one."
        showPagination={true}
        currentPage={metadata?.currentPage || currentPage}
        totalPages={metadata?.totalPage || 1}
        totalItems={metadata?.totalData || 0}
        pageSize={metadata?.perPage || pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
