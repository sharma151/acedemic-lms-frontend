"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useQueryParam } from "@/hooks/use-query-params";
import { useGetAcademicYears } from "../api/years";
import { AcademicYear } from "../types";
import { AcademicYearDialog } from "./AcademicYearDialog";

export const AcademicYearsTab = () => {
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("");
  
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  const { data: response, isLoading } = useGetAcademicYears({
    page: currentPage,
    limit: pageSize
  });
  
  const years = response?.data || [];
  const metadata = response?.metadata;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingYear(null);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<AcademicYear>[] = [
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
      header: "Start Date",
      accessorKey: "startDate",
    },
    {
      header: "End Date",
      accessorKey: "endDate",
    },
    {
      header: "Status",
      cell: (year) => {
        const statusColors = {
          ACTIVE: "bg-green-100 text-green-700 hover:bg-green-100",
          UPCOMING: "bg-blue-100 text-blue-700 hover:bg-blue-100",
          COMPLETED: "bg-slate-100 text-slate-700 hover:bg-slate-100",
        };
        return (
          <Badge className={statusColors[year.status]} variant="secondary">
            {year.status}
          </Badge>
        );
      },
    },
    {
      header: "Current",
      cell: (year) => {
        if (year.isCurrent) {
          return (
            <div className="flex items-center text-amber-600 bg-amber-50 w-fit px-2 py-1 rounded-md text-xs font-semibold border border-amber-200">
              <Star className="w-3 h-3 mr-1 fill-amber-500" />
              Current
            </div>
          );
        }
        return null;
      },
    },
    {
      header: "Actions",
      cell: (year) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(year);
          }}
          className="text-teal-700 hover:text-teal-800 hover:bg-teal-50"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Academic Years
          </h3>
          <p className="text-sm text-slate-500">
            Manage the academic sessions and terms for your institution.
          </p>
        </div>
        <Button onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Academic Year
        </Button>
      </div>

      <DataTable
        data={years}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No academic years found. Click 'Add Academic Year' to create one."
        showPagination={true}
        currentPage={metadata?.currentPage || currentPage}
        totalPages={metadata?.totalPage || 1}
        totalItems={metadata?.totalData || years.length}
        pageSize={metadata?.perPage || pageSize}
        onPageChange={(page) => setQueryParams({ page: page.toString() })}
        onPageSizeChange={(size) =>
          setQueryParams({ limit: size.toString(), page: "1" })
        }
      />

      <AcademicYearDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setTimeout(() => setEditingYear(null), 300);
        }}
        academicYear={editingYear}
      />
    </div>
  );
};
