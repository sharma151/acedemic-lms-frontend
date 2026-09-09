import React from "react";
import { SettingsForm } from "@/features/settings/components/SettingsForm";

export const metadata = {
  title: "Settings | Super Admin",
  description: "Manage global institution settings",
};

export default function SuperAdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
        <p className="text-muted-foreground">
          Manage platform and institution settings.
        </p>
      </div>
      <div className="flex-1 w-full">
        <SettingsForm />
      </div>
    </div>
  );
}
