import { Metadata } from "next";
import { DashboardTemplate } from "@/features/dashboard/components/DashboardTemplate";

export const metadata: Metadata = {
  title: "Dashboard | Academic LMS",
  description: "Overview of your platform activity and metrics.",
};

export default function SuperAdminDashboardPage() {
  return (
    <div className="w-full">
      <DashboardTemplate role="super-admin" />
    </div>
  );
}
