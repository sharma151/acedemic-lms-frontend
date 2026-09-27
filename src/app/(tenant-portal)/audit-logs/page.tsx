import { AuditLogsModule } from "@/features/audit-logs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs | Tenant",
  description: "View and filter system audit logs.",
};

export default function AuditLogsPage() {
  return <AuditLogsModule />;
}
