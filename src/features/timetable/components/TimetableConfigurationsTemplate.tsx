"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Settings2, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useQueryParam } from "@/hooks/use-query-params";
import { useGetConfigurations, useDeleteConfiguration } from "../api/timetable";
import { TimetableConfiguration } from "../types";
import { ConfigurationDialog } from "./ConfigurationDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const TimetableConfigurationsTemplate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("");
  
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  const { data: response, isLoading } = useGetConfigurations({
    page: currentPage,
    limit: pageSize
  });
  
  const deleteMutation = useDeleteConfiguration();

  const configurations = response?.data || [];
  const metadata = response?.metadata;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<TimetableConfiguration | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<TimetableConfiguration | null>(null);

  const handleEdit = (config: TimetableConfiguration) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingConfig(null);
    setIsDialogOpen(true);
  };

  const handleConfigure = (config: TimetableConfiguration) => {
    router.push(`/timetable-configurations/${config.id}`);
  };

  const handleDelete = (config: TimetableConfiguration) => {
    setConfigToDelete(config);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (configToDelete) {
      deleteMutation.mutate(configToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setConfigToDelete(null);
        }
      });
    }
  };

  const columns: ColumnDef<TimetableConfiguration>[] = [
    {
      header: "S.N.",
      className: "w-16 font-medium text-slate-500",
      cell: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Academic Year",
      cell: (config) => config.academicYear?.name || "-",
    },
    {
      header: "Status",
      cell: (config) => {
        const statusColors = {
          ACTIVE: "bg-green-100 text-green-700 hover:bg-green-100",
          DRAFT: "bg-amber-100 text-amber-700 hover:bg-amber-100",
          ARCHIVED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
        };
        return (
          <Badge className={statusColors[config.status]} variant="secondary">
            {config.status}
          </Badge>
        );
      },
    },
    {
      header: "Default",
      cell: (config) => {
        if (config.isDefault) {
          return (
            <div className="flex items-center text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded-md text-xs font-semibold border border-teal-200">
              <Star className="w-3 h-3 mr-1 fill-teal-500" />
              Default
            </div>
          );
        }
        return null;
      },
    },
    {
      header: "Days / Periods",
      cell: (config) => `${config.totalDays || 0} Days, ${config.totalPeriods || 0} Periods`,
    },
    {
      header: "Actions",
      cell: (config) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleConfigure(config)} className="cursor-pointer">
              <Settings2 className="mr-2 h-4 w-4" />
              Configure Schedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(config)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(config)} className="text-red-600 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Timetable Configurations
          </h3>
          <p className="text-sm text-slate-500">
            Manage schedule templates, working days, and periods for your institution.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          New Configuration
        </Button>
      </div>

      <DataTable
        data={configurations}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No configurations found. Click 'New Configuration' to create one."
        showPagination={true}
        currentPage={metadata?.currentPage || currentPage}
        totalPages={metadata?.totalPage || 1}
        totalItems={metadata?.totalData || configurations.length}
        pageSize={metadata?.perPage || pageSize}
        onPageChange={(page) => setQueryParams({ page: page.toString() })}
        onPageSizeChange={(size) =>
          setQueryParams({ limit: size.toString(), page: "1" })
        }
      />

      <ConfigurationDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setTimeout(() => setEditingConfig(null), 300);
        }}
        configuration={editingConfig}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Configuration"
        description={`Are you sure you want to delete ${configToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
