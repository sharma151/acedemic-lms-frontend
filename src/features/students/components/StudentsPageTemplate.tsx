"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParam } from "@/hooks/use-query-params";
import { Student } from "../types";
import { useStudents } from "../api/students";
import { StudentFormDialog } from "./StudentFormDialog";
import { useGetAcademicYears } from "@/features/academics/api/years";
import { useGetClassSections } from "@/features/academics/api/classes";

interface StudentsPageTemplateProps {
  title: string;
  description: string;
  basePath: string;
}

export const StudentsPageTemplate = ({
  title,
  description,
  basePath,
}: StudentsPageTemplateProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const admissionNumber = searchParams.get("admissionNumber") || "";
  const classId = searchParams.get("classId") || "all";
  const academicYearId = searchParams.get("academicYearId") || "all";
  const status = searchParams.get("status") || "all";

  const { data: studentsResponse, isLoading } = useStudents({
    page: currentPage,
    limit: pageSize,
    search: search || undefined,
    admissionNumber: admissionNumber || undefined,
    classId: classId === "all" ? undefined : classId,
    academicYearId: academicYearId === "all" ? undefined : academicYearId,
    status: status === "all" ? undefined : status,
  });

  const students = studentsResponse?.data || [];
  const metadata = studentsResponse?.metadata;

  const { data: academicYearsResponse, isLoading: isLoadingYears } =
    useGetAcademicYears();
  const academicYears = academicYearsResponse?.data || [];

  const { data: classesResponse, isLoading: isLoadingClasses } =
    useGetClassSections();
  const classes = classesResponse?.data || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: ColumnDef<Student>[] = [
    {
      header: "S.N.",
      className: "w-16 font-medium text-slate-500",
      cell: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },

    {
      header: "Name",
      cell: (student) => {
        const fullName = `${student?.user?.firstName} ${student?.user?.lastName}`;
        return `${fullName}`;
      },
    },
    {
      header: "Class",
      cell: (student) => {
        const enrollment = student.currentEnrollment;
        if (!enrollment)
          return <span className="text-muted-foreground">—</span>;
        return `${enrollment.class?.name || "N/A"}-${enrollment.class?.section || "N/A"}`;
      },
    },
    {
      header: "Roll",
      cell: (student) => {
        const enrollment = student.currentEnrollment;
        if (!enrollment)
          return <span className="text-muted-foreground">—</span>;
        return `  ${enrollment.rollNumber}`;
      },
    },
    {
      header: "Admission No",
      accessorKey: "admissionNumber",
      className: "font-medium text-slate-900",
    },
    {
      header: "Emergency Contact",
      accessorKey: "emergencyContactPhone",
    },
    {
      header: "Status",
      cell: (student) => {
        const statusColors: Record<string, string> = {
          ACTIVE: "bg-green-100 text-green-700",
          INACTIVE: "bg-slate-100 text-slate-700",
          SUSPENDED: "bg-red-100 text-red-700",
          ALUMNI: "bg-blue-100 text-blue-700",
        };
        return (
          <Badge
            className={
              statusColors[student.status] || "bg-slate-100 text-slate-700"
            }
            variant="secondary"
          >
            {student.status}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: (student) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`${basePath}/${student.id}`);
          }}
          className="text-teal-700 hover:text-teal-800 hover:bg-teal-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
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
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search name..."
            value={search}
            onChange={(e) =>
              setQueryParams({ search: e.target.value || null, page: "1" })
            }
            className="pl-9 bg-white"
          />
        </div>

        <Input
          placeholder="Admission No."
          value={admissionNumber}
          onChange={(e) =>
            setQueryParams({
              admissionNumber: e.target.value || null,
              page: "1",
            })
          }
          className="bg-white"
        />

        <Select
          value={academicYearId}
          onValueChange={(val) =>
            setQueryParams({ academicYearId: val, page: "1" })
          }
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Academic Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {academicYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={classId}
          onValueChange={(val) => setQueryParams({ classId: val, page: "1" })}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name} {cls.section ? `(${cls.section})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(val) => setQueryParams({ status: val, page: "1" })}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="ALUMNI">Alumni</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={students}
        columns={columns}
        isLoading={isLoading || isLoadingYears || isLoadingClasses}
        emptyMessage="No students found."
        showPagination={true}
        currentPage={metadata?.currentPage || currentPage}
        totalPages={metadata?.totalPage || 1}
        totalItems={metadata?.totalData || students.length}
        pageSize={metadata?.perPage || pageSize}
        onPageChange={(page) => setQueryParams({ page: page.toString() })}
        onPageSizeChange={(size) =>
          setQueryParams({ limit: size.toString(), page: "1" })
        }
        onRowClick={(student) => router.push(`${basePath}/${student.id}`)}
      />

      <StudentFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        academicYears={academicYears}
        classes={classes}
      />
    </div>
  );
};
