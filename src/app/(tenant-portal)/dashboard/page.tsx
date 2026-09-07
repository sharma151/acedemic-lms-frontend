import { Metadata } from "next";
import { DashboardTemplate } from "@/features/dashboard/components/DashboardTemplate";

export const metadata: Metadata = {
  title: "Dashboard | Academic LMS",
  description: "Overview of your institution activity and metrics.",
};

export default function TenantDashboardPage() {
  return (
    <div className="w-full">
      <DashboardTemplate role="tenant" />
    </div>
  );
}
