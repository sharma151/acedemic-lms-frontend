"use client";

import { useRouter } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { useFormatDate } from "@/hooks/use-format-date";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TenantData,
  activateTenantApi,
  suspendTenantApi,
} from "../api/tenants";
import { TENANT_STATUS } from "@/configs/constants";
import { QUERY_KEYS } from "@/configs/querykey";
import { AddTenantDialog } from "./AddTenantDialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNotifications } from "@/components/ui/notifications";

import { useTenantsList } from "../hooks/useTenantsList";

interface TenantsPageTemplateProps {
  title: string;
  description: string;
}

export function TenantsPageTemplate({
  title,
  description,
}: TenantsPageTemplateProps) {
  const router = useRouter();
  const { formatDate } = useFormatDate();
  const [tenantToSuspend, setTenantToSuspend] = useState<TenantData | null>(
    null,
  );
  const [tenantToActivate, setTenantToActivate] = useState<TenantData | null>(
    null,
  );
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const { tenants, metadata, isLoading, filters, setQueryParams } =
    useTenantsList();
  const { currentPage, pageSize, name, status } = filters;

  const activateMutation = useMutation({
    mutationFn: activateTenantApi,
    onSuccess: () => {
      addNotification({
        type: "success",
        title: "Tenant activated successfully",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TENANTS] });
      setTenantToActivate(null);
    },
    onError: () => {
      addNotification({ type: "error", title: "Failed to activate tenant" });
      setTenantToActivate(null);
    },
  });

  const suspendMutation = useMutation({
    mutationFn: suspendTenantApi,
    onSuccess: () => {
      addNotification({
        type: "success",
        title: "Tenant suspended successfully",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TENANTS] });
      setTenantToSuspend(null);
    },
    onError: () => {
      addNotification({ type: "error", title: "Failed to suspend tenant" });
      setTenantToSuspend(null);
    },
  });

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
    {
      header: "Actions",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              disabled={activateMutation.isPending || item.status === "active"}
              onClick={(e) => {
                e.stopPropagation();
                setTenantToActivate(item);
              }}
            >
              Activate
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={suspendMutation.isPending || item.status === "suspended"}
              onClick={(e) => {
                e.stopPropagation();
                setTenantToSuspend(item);
              }}
            >
              Suspend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      {/* // Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center  gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 py-2">
          <div className="space-y-2">
            <label
              htmlFor="search-activities"
              className="text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={name}
                className="pl-10 max-w-sm"
                onChange={(e) => {
                  setQueryParams({ name: e.target.value || null, page: "1" });
                }}
                maxLength={255}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="search-activities"
            className="text-sm font-medium text-gray-700"
          >
            Filter by status
          </label>
          <div className="relative">
            <Select
              value={status}
              onValueChange={(val) => {
                setQueryParams({
                  status: val === "All" ? "--" : val,
                  page: "1",
                });
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TENANT_STATUS).map(([key, val]) => {
                  const itemValue = key === "ALL" ? "all" : val;
                  const itemLabel = key === "ALL" ? "All" : key;
                  return (
                    <SelectItem key={key} value={itemValue}>
                      {itemLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* // Data Table Section */}
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
        onPageChange={(page) => setQueryParams({ page: page.toString() })}
        onPageSizeChange={(size) =>
          setQueryParams({ limit: size.toString(), page: "1" })
        }
        onRowClick={(item) => router.push(`/super-admin/tenants/${item.id}`)}
      />

      <ConfirmDialog
        isOpen={!!tenantToSuspend}
        onClose={() => setTenantToSuspend(null)}
        onConfirm={() =>
          tenantToSuspend && suspendMutation.mutate(tenantToSuspend.id)
        }
        title={
          <>
            Suspend <strong>{tenantToSuspend?.name || "Tenant"}</strong>?
          </>
        }
        description={
          <>
            Are you sure you want to suspend{" "}
            <strong>{tenantToSuspend?.name || "this tenant"}</strong>? They will
            no longer be able to access the platform.
          </>
        }
        confirmText="Suspend"
        variant="destructive"
        isLoading={suspendMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!tenantToActivate}
        onClose={() => setTenantToActivate(null)}
        onConfirm={() =>
          tenantToActivate && activateMutation.mutate(tenantToActivate.id)
        }
        title={
          <>
            Activate <strong>{tenantToActivate?.name || "Tenant"}</strong>?
          </>
        }
        description={
          <>
            Are you sure you want to activate{" "}
            <strong>{tenantToActivate?.name || "this tenant"}</strong>? They
            will regain access to the platform.
          </>
        }
        confirmText="Activate"
        variant="default"
        isLoading={activateMutation.isPending}
      />
    </div>
  );
}
