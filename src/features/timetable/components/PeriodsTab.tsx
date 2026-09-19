"use client";
import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useGetPeriods, useDeletePeriod } from "../api/timetable";
import { Period } from "../types";
import { PeriodDialog } from "./PeriodDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface PeriodsTabProps {
  configurationId: string;
}

export const PeriodsTab = ({ configurationId }: PeriodsTabProps) => {
  const { data: periods = [], isLoading } = useGetPeriods(configurationId);
  const deleteMutation = useDeletePeriod(configurationId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState<Period | null>(null);

  const handleEdit = (period: Period) => {
    setEditingPeriod(period);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPeriod(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (period: Period) => {
    setPeriodToDelete(period);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (periodToDelete) {
      deleteMutation.mutate(
        { configurationId, periodId: periodToDelete.id },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setPeriodToDelete(null);
          },
        }
      );
    }
  };

  const columns: ColumnDef<Period>[] = [
    {
      header: "Order",
      accessorKey: "displayOrder",
      className: "w-16 font-medium text-slate-500",
    },
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Time",
      cell: (period) => `${period.startTime} - ${period.endTime}`,
    },
    {
      header: "Type",
      cell: (period) => {
        return period.type === "BREAK" ? (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100" variant="secondary">
            Break
          </Badge>
        ) : (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100" variant="secondary">
            Period
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: (period) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(period);
            }}
            className="text-teal-700 hover:text-teal-800 hover:bg-teal-50"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(period);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Periods & Breaks
          </h3>
          <p className="text-sm text-slate-500">
            Configure the daily class periods and break times.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Period
        </Button>
      </div>

      <DataTable
        data={periods}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No periods configured. Click 'Add Period' to create one."
      />

      <PeriodDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setTimeout(() => setEditingPeriod(null), 300);
        }}
        configurationId={configurationId}
        period={editingPeriod}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Period"
        description={`Are you sure you want to delete ${periodToDelete?.name}?`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
