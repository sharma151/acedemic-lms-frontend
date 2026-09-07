import { ProfileTemplate } from "@/features/profile/components/ProfileTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Profile | Academic LMS",
  description: "View and manage your personal profile.",
};

export default function TenantProfilePage() {
  return (
    <div className="w-full">
      <ProfileTemplate />
    </div>
  );
}
