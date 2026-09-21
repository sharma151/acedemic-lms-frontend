"use client";
import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useGetWorkingDays, useDeleteWorkingDay, useUpdateWorkingDay } from "../api/timetable";
import { WorkingDay } from "../types";
import { WorkingDayDialog } from "./WorkingDayDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface WorkingDaysTabProps {
  configurationId: string;
}

export const WorkingDaysTab = ({ configurationId }: WorkingDaysTabProps) => {
  const { data: days = [], isLoading } = useGetWorkingDays(configurationId);
  const deleteMutation = useDeleteWorkingDay(configurationId);
  const updateMutation = useUpdateWorkingDay(configurationId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkingDay | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dayToDelete, setDayToDelete] = useState<WorkingDay | null>(null);

  const handleEdit = (day: WorkingDay) => {
    setEditingDay(day);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDay(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (day: WorkingDay) => {
    setDayToDelete(day);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleWorkingDay = (day: WorkingDay, checked: boolean) => {
    updateMutation.mutate({
      configurationId,
      dayId: day.id,
      data: { isWorkingDay: checked }
    });
  };

  const confirmDelete = () => {
    if (dayToDelete) {
      deleteMutation.mutate(
        { configurationId, dayId: dayToDelete.id },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            setDayToDelete(null);
          },
        }
      );
    }
  };

  const columns: ColumnDef<WorkingDay>[] = [
    {
      header: "Order",
      accessorKey: "displayOrder",
      className: "w-16 font-medium text-slate-500",
    },
    {
      header: "Day",
      cell: (day) => {
        const daysMap: Record<string, string> = {
          "MONDAY": "Monday",
          "TUESDAY": "Tuesday",
          "WEDNESDAY": "Wednesday",
          "THURSDAY": "Thursday",
          "FRIDAY": "Friday",
          "SATURDAY": "Saturday",
          "SUNDAY": "Sunday"
        };
        return daysMap[day.day as string] || day.day;
      }
    },
    {
      header: "Label",
      accessorKey: "label",
      className: "font-medium",
    },
    {
      header: "Is Working Day",
      cell: (day) => (
        <Switch 
          checked={day.isWorkingDay} 
          onCheckedChange={(checked) => handleToggleWorkingDay(day, checked)}
          disabled={updateMutation.isPending}
        />
      ),
    },
    {
      header: "Status",
      cell: (day) => {
        return day.isWorkingDay ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100" variant="secondary">
            Working Day
          </Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100" variant="secondary">
            Off Day
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: (day) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(day);
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
              handleDelete(day);
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
            Working Days
          </h3>
          <p className="text-sm text-slate-500">
            Configure the working days for this timetable.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Day
        </Button>
      </div>

      <DataTable
        data={days}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No working days configured. Click 'Add Day' to create one."
      />

      <WorkingDayDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setTimeout(() => setEditingDay(null), 300);
        }}
        configurationId={configurationId}
        workingDay={editingDay}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Working Day"
        description={`Are you sure you want to delete ${dayToDelete?.label}?`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
