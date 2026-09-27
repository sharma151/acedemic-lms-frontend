"use client";

import React from "react";
import { AuditLogFilter } from "./AuditLogFilter";
import { AuditLogTable } from "./AuditLogTable";
import { usePathname } from "next/navigation";

export const AuditLogsModule: React.FC = () => {
  const pathname = usePathname();
  const isSuperAdmin = pathname?.startsWith("/super-admin");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Audit Logs
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Monitor and review system activities and security events.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border shadow-sm">
        <AuditLogFilter isSuperAdmin={isSuperAdmin} />
        <AuditLogTable />
      </div>
    </div>
  );
};
