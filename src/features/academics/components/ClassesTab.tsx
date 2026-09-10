"use client";
import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParam } from "@/hooks/use-query-params";
import { useGetClassSections } from "../api/classes";
import { useGetAcademicYears } from "../api/years";
import { ClassSection } from "../types";
import { ClassDialog } from "./ClassDialog";

export const ClassesTab = () => {
  const {
    value: academicYearId,
    setValue: setAcademicYearId,
    remove: removeAcademicYearId,
  } = useQueryParam("academicYearId");
  const selectedYearId = academicYearId || "all";

  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  const { data: classResponse, isLoading: isLoadingClasses } =
    useGetClassSections({
      academicYearId: academicYearId || undefined,
      page: currentPage,
      limit: pageSize,
    });
  const classes = classResponse?.data || [];
  const metadata = classResponse?.metadata;

  const { data: yearsResponse, isLoading: isLoadingYears } =
    useGetAcademicYears();
  const years = yearsResponse?.data || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSection | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (classSection: ClassSection) => {
    setEditingClass(classSection);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingClass(null);
    setIsDialogOpen(true);
  };

  // Build a lookup map for faster academic year name resolution
  const yearMap = useMemo(() => {
    return years.reduce(
      (acc, year) => {
        acc[year.id] = year.name;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [years]);

  // Filter classes based on search query (academic year is handled by API)
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesSearch =
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cls.section &&
          cls.section.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [classes, searchQuery]);

  const columns: ColumnDef<ClassSection>[] = [
    {
      header: "S.N.",
      className: "w-16 font-medium text-slate-500",
      cell: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      header: "Class Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Section",
      cell: (cls) =>
        cls.section || <span className="text-muted-foreground">—</span>,
    },
    {
      header: "Academic Year",
      cell: (cls) =>
        yearMap[cls.academicYearId] || (
          <span className="text-muted-foreground">Unknown</span>
        ),
    },
    {
      header: "Actions",
      cell: (cls) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(cls);
          }}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      ),
    },
  ];

  const isLoading = isLoadingClasses || isLoadingYears;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Classes & Sections
          </h3>
          <p className="text-sm text-slate-500">
            Manage the classes and their respective sections for the academic
            years.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select
            value={selectedYearId}
            onValueChange={(val) => {
              if (val === "all") {
                removeAcademicYearId();
              } else {
                setAcademicYearId(val);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-62.5 bg-white">
              <SelectValue placeholder="Filter by Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Academic Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-62.5">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search classes..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DataTable
        data={filteredClasses}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No classes found."
        showPagination={true}
        currentPage={metadata?.currentPage || currentPage}
        totalPages={metadata?.totalPage || 1}
        totalItems={metadata?.totalData || filteredClasses.length}
        pageSize={metadata?.perPage || pageSize}
        onPageChange={(page) => setQueryParams({ page: page.toString() })}
        onPageSizeChange={(size) =>
          setQueryParams({ limit: size.toString(), page: "1" })
        }
      />

      <ClassDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setTimeout(() => setEditingClass(null), 300);
        }}
        classSection={editingClass}
      />
    </div>
  );
};
