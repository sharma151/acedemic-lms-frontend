"use client";

import { useQuery } from "@tanstack/react-query";
import { getTenantById, TenantUser } from "../api/tenants";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormatDate } from "@/hooks/use-format-date";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useSession } from "@/lib/session";
import { AddUserDialog } from "@/features/users/components/AddUserDialog";
import { QUERY_KEYS } from "@/configs/querykey";
import { Role } from "@/configs/constants";

interface TenantDetailsPageTemplateProps {
  tenantId: string;
}

type TabKey =
  | "institutionAdmins"
  | "teachers"
  | "students"
  | "parents"
  | "accountants";

export function TenantDetailsPageTemplate({
  tenantId,
}: TenantDetailsPageTemplateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { formatDate } = useFormatDate();

  const user = useSession((state) => state.user);
  const activeTab = (searchParams.get("tab") as TabKey) || "institutionAdmins";

  const handleTabChange = (key: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.TENANT_DETAILS, tenantId],
    queryFn: () => getTenantById(tenantId),
    enabled: !!tenantId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh] flex-col gap-4 text-center">
        <h3 className="text-xl font-bold text-destructive">
          Failed to load tenant
        </h3>
        <p className="text-muted-foreground max-w-md">
          There was an error retrieving the tenant information.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const tenant = response.data;
  const users = {
    institutionAdmins: tenant.users?.institutionAdmins || [],
    teachers: tenant.users?.teachers || [],
    students: tenant.users?.students || [],
    parents: tenant.users?.parents || [],
    accountants: tenant.users?.accountants || [],
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "institutionAdmins", label: "Institution Admins" },
    { key: "teachers", label: "Teachers" },
    { key: "students", label: "Students" },
    { key: "parents", label: "Parents" },
    { key: "accountants", label: "Accountants" },
  ];

  const columns: ColumnDef<TenantUser>[] = [
    {
      header: "Name",
      cell: (item) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {item.firstName} {item.lastName}
        </span>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      cell: (item) => (
        <Badge variant="outline" className="bg-slate-50 text-slate-700">
          {item.role}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <Badge
          variant="outline"
          className={
            item.isActive
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
              : "border-red-200 bg-red-50 text-red-700"
          }
        >
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Joined",
      cell: (item) => (
        <span className="text-slate-500">
          {formatDate(item.createdAt, "DEFAULT")}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{tenant.name}</h2>
          <p className="text-muted-foreground mt-1">
            Manage tenant details and users.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
            <CardTitle>
              <Badge
                variant="outline"
                className={
                  tenant.status === "active"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }
              >
                {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Isolation Mode</CardDescription>
            <CardTitle className="text-lg capitalize">
              {tenant.isolationMode}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Created At</CardDescription>
            <CardTitle className="text-lg">
              {formatDate(tenant.createdAt, "DEFAULT")}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-lg">
              {users.institutionAdmins.length +
                users.teachers.length +
                users.students.length +
                users.parents.length +
                users.accountants.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">Users</h3>
          {user?.role === Role.INSTITUTION_ADMIN && (
            <AddUserDialog tenantId={tenantId}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Users
              </Button>
            </AddUserDialog>
          )}
        </div>

        {/* Custom Tabs */}
        <div className="border-b border-border flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label} ({users[tab.key].length})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          <DataTable
            data={users[activeTab]}
            columns={columns}
            emptyMessage={`No ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase()} found.`}
          />
        </div>
      </div>
    </div>
  );
}
