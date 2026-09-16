"use client";
import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Search,
  UserCog,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useQueryParam } from "@/hooks/use-query-params";
import { useGetSubjects, useGetSubjectsByClass } from "../api/subjects";
import { useDeleteSubject } from "../api/subjects";
import { useGetClassSections } from "../api/classes";
import { Subject, ClassSection } from "../types";
import { SubjectDialog } from "./SubjectDialog";
import { AssignTeacherDialog } from "./AssignTeacherDialog";
import { useDebounce } from "@/hooks/use-debounce";
import { useSession } from "@/lib/session";
import { useQuery } from "@tanstack/react-query";
import { getTenantById } from "@/features/tenants/api/tenants";
import { QUERY_KEYS } from "@/configs/querykey";

export const SubjectsTab = () => {
  const tenantId = useSession((s) => s.tenantId);

  // Fetch tenant data to get teachers list
  const { data: tenantResponse } = useQuery({
    queryKey: [QUERY_KEYS.TENANT_DETAILS, tenantId],
    queryFn: () => getTenantById(tenantId!),
    enabled: !!tenantId,
  });
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParam("");

  // Pagination from URL
  const currentPage = Number(searchParams.get("subPage")) || 1;
  const pageSize = Number(searchParams.get("subLimit")) || 10;

  // Filters
  const [searchInput, setSearchInput] = useState(
    searchParams.get("subSearch") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 400);

  const { value: classIdFilter } = useQueryParam("subClassId");

  // Fetch data
  const getSubjectsParams = {
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch || undefined,
  };

  const { data: allSubjectsResponse, isLoading: isLoadingAll } = useGetSubjects(
    getSubjectsParams,
    !classIdFilter,
  );

  const { data: classSubjectsResponse, isLoading: isLoadingClass } =
    useGetSubjectsByClass(classIdFilter || "", getSubjectsParams);

  const subjectsResponse = classIdFilter
    ? classSubjectsResponse
    : allSubjectsResponse;
  const isLoading = classIdFilter ? isLoadingClass : isLoadingAll;

  const subjects = subjectsResponse?.data || [];
  const metadata = subjectsResponse?.metadata;

  const { data: classesResponse, isLoading: isLoadingClasses } =
    useGetClassSections();
  let classes: ClassSection[] = [];
  if (Array.isArray(classesResponse?.data)) {
    classes = classesResponse.data;
  } else if (Array.isArray(classesResponse)) {
    classes = classesResponse as any;
  } else if (
    classesResponse?.data &&
    typeof classesResponse.data === "object"
  ) {
    classes = Object.values(classesResponse.data).flat() as ClassSection[];
  }

  // Dialog state
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [assignTeacherSubject, setAssignTeacherSubject] =
    useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const deleteMutation = useDeleteSubject();

  // Class lookup map
  const classMap = useMemo(() => {
    return classes.reduce(
      (acc: Record<string, string>, cls: any) => {
        acc[cls.id] = cls.name + (cls.section ? ` — ${cls.section}` : "");
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [classes]);

  // Normalized teachers list for dialogs
  const teacherOptions = useMemo(
    () =>
      (tenantResponse?.data?.users?.teachers || []).map((t) => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
      })),
    [tenantResponse],
  );

  const handleAdd = () => {
    setEditingSubject(null);
    setIsSubjectDialogOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsSubjectDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setQueryParams({ subSearch: e.target.value || null, subPage: "1" });
  };

  const columns: ColumnDef<Subject>[] = [
    {
      header: "S.N.",
      className: "w-14 font-medium text-slate-500",
      cell: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      header: "Subject Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Code",
      cell: (sub) => (
        <Badge variant="outline" className="font-mono text-xs">
          {sub.code}
        </Badge>
      ),
    },
    {
      header: "Class",
      cell: (sub) =>
        sub.class
          ? `${sub.class.name}${sub.class.section ? ` — ${sub.class.section}` : ""}`
          : classMap[sub.classId] || (
              <span className="text-muted-foreground">—</span>
            ),
    },
    {
      header: "Assigned Teacher",
      cell: (sub) =>
        sub.teacher ? (
          <span className="font-medium">
            {sub.teacher.firstName} {sub.teacher.lastName}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm italic">
            Not assigned
          </span>
        ),
    },
    {
      header: "Description",
      cell: (sub) =>
        sub.description ? (
          <span
            className="text-slate-500 text-sm line-clamp-1 max-w-[200px]"
            title={sub.description}
          >
            {sub.description}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: "Actions",
      className: "w-16 text-right",
      cell: (sub) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => handleEdit(sub)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssignTeacherSubject(sub)}>
              <UserCog className="mr-2 h-4 w-4" />
              Assign Teacher
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeletingSubject(sub)}
            >
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Subjects</h3>
          <p className="text-sm text-slate-500">
            Manage subjects, their class assignments, and assigned teachers.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or code..."
            className="pl-9 bg-white"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter by class */}
        <Select
          value={classIdFilter || "all"}
          onValueChange={(val) => {
            setQueryParams({
              subClassId: val === "all" ? null : val,
              subPage: "1",
            });
          }}
        >
          <SelectTrigger className="w-full sm:w-60 bg-white">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
                {cls.section ? ` — ${cls.section}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={subjects}
        columns={columns}
        isLoading={isLoading || isLoadingClasses}
        emptyMessage="No subjects found. Click 'Add Subject' to create one."
        showPagination={true}
        currentPage={metadata?.currentPage || currentPage}
        totalPages={metadata?.totalPage || 1}
        totalItems={metadata?.totalData || subjects.length}
        pageSize={metadata?.perPage || pageSize}
        onPageChange={(page) => setQueryParams({ subPage: page.toString() })}
        onPageSizeChange={(size) =>
          setQueryParams({ subLimit: size.toString(), subPage: "1" })
        }
      />

      {/* Create / Edit Dialog */}
      <SubjectDialog
        open={isSubjectDialogOpen}
        onOpenChange={(open) => {
          setIsSubjectDialogOpen(open);
          if (!open) setTimeout(() => setEditingSubject(null), 300);
        }}
        subject={editingSubject}
        teachers={teacherOptions}
      />

      {/* Assign Teacher Dialog */}
      <AssignTeacherDialog
        open={!!assignTeacherSubject}
        onOpenChange={(open) => {
          if (!open) setTimeout(() => setAssignTeacherSubject(null), 300);
        }}
        subject={assignTeacherSubject}
        teachers={teacherOptions}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        onConfirm={() => {
          if (deletingSubject) {
            deleteMutation.mutate(deletingSubject.id, {
              onSuccess: () => setDeletingSubject(null),
              onError: () => setDeletingSubject(null),
            });
          }
        }}
        title={
          <>
            Delete <strong>{deletingSubject?.name}</strong>?
          </>
        }
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{deletingSubject?.name}</strong>? This action cannot be
            undone.
          </>
        }
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
