"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export interface UserData {
  id: string;
  sn: number;
  name: string;
  subtitle?: string;
  email: string;
  organization: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

const dummyData: UserData[] = [
  {
    id: "1",
    sn: 1,
    name: "Aarav Sharma",
    subtitle: "Lead Developer",
    email: "aarav.sharma@example.com",
    organization: "PCU",
    role: "Admin Federal",
    status: "Active",
    lastLogin: "Aug 28, 2026 10:15 AM",
  },
  {
    id: "2",
    sn: 2,
    name: "Sunita Thapa",
    subtitle: "Operations Manager",
    email: "sunita.thapa@example.com",
    organization: "KTM_PPSU",
    role: "Admin Provincial",
    status: "Active",
    lastLogin: "Aug 30, 2026 04:20 PM",
  },
  {
    id: "3",
    sn: 3,
    name: "Rohan Shrestha",
    subtitle: "System Administrator",
    email: "rohan.shrestha@example.com",
    organization: "PKR_PPSU",
    role: "Admin Provincial",
    status: "Active",
    lastLogin: "Sep 01, 2026 09:05 AM",
  },
  {
    id: "4",
    sn: 4,
    name: "Pooja KC",
    email: "pooja.kc@example.com",
    organization: "—",
    role: "Viewer",
    status: "Active",
    lastLogin: "Never",
  },
  {
    id: "5",
    sn: 5,
    name: "Bikash Adhikari",
    subtitle: "Database Engineer",
    email: "bikash.adhikari@example.com",
    organization: "PCU",
    role: "Admin Federal",
    status: "Active",
    lastLogin: "Aug 25, 2026 02:40 PM",
  },
  {
    id: "6",
    sn: 6,
    name: "Anjali Gurung",
    subtitle: "Field Coordinator",
    email: "anjali.gurung@example.com",
    organization: "BTL_PPSU",
    role: "Admin Provincial",
    status: "Active",
    lastLogin: "Aug 15, 2026 11:30 AM",
  },
  {
    id: "7",
    sn: 7,
    name: "Kiran Maharjan",
    email: "kiran.maharjan@example.com",
    organization: "—",
    role: "Data Analyst",
    status: "Inactive",
    lastLogin: "Jul 10, 2026 05:12 PM",
  },
  {
    id: "8",
    sn: 8,
    name: "Suman Joshi",
    subtitle: "Security Officer",
    email: "suman.joshi@example.com",
    organization: "PCU",
    role: "Admin Federal",
    status: "Active",
    lastLogin: "Aug 31, 2026 08:45 AM",
  },
  {
    id: "10",
    sn: 9,
    name: "Deepa Bhattarai",
    subtitle: "QA Specialist",
    email: "deepa.bhattarai@example.com",
    organization: "KTM_PPSU",
    role: "Admin Provincial",
    status: "Active",
    lastLogin: "Aug 29, 2026 03:00 PM",
  },

  {
    id: "12",
    sn: 10,
    name: "Sarita Lama",
    subtitle: "Regional Supervisor",
    email: "sarita.lama@example.com",
    organization: "HTD_PPSU",
    role: "Admin Provincial",
    status: "Active",
    lastLogin: "Aug 27, 2026 12:15 PM",
  },
  {
    id: "13",
    sn: 11,
    name: "Nabin Poudel",
    subtitle: "IT Support",
    email: "nabin.poudel@example.com",
    organization: "PCU",
    role: "Admin Federal",
    status: "Active",
    lastLogin: "Sep 02, 2026 11:20 AM",
  },
];

const columns: ColumnDef<UserData>[] = [
  {
    header: "S.N.",
    accessorKey: "sn",
    className: "w-16 font-medium",
  },
  {
    header: "User",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-medium text-blue-600 dark:text-blue-400">
          {item.name}
        </span>
        {item.subtitle && (
          <span className="text-xs text-slate-500">{item.subtitle}</span>
        )}
      </div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Organization",
    accessorKey: "organization",
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Status",
    cell: (item) => (
      <Badge
        variant="outline"
        className={
          item.status === "Active"
            ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }
      >
        {item.status}
      </Badge>
    ),
  },
  {
    header: "Last Login",
    accessorKey: "lastLogin",
  },
  {
    header: "Action",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
        <MoreVertical className="h-4 w-4" />
      </Button>
    ),
    className: "text-right",
    headerClassName: "text-right",
  },
];

interface UsersPageTemplateProps {
  title: string;
  description: string;
  // In the future, you can pass data, columns, or API hooks directly here!
}

export function UsersPageTemplate({
  title,
  description,
}: UsersPageTemplateProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm"> */}
      <DataTable
        data={dummyData}
        columns={columns}
        showPagination={true}
        currentPage={currentPage}
        totalPages={10}
        totalItems={95}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
    // </div>
  );
}
