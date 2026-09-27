import React from "react";
import { SettingsForm } from "@/features/settings";

export const metadata = {
  title: "Settings | Academic LMS",
  description: "Manage institution settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your institution settings and contact details.
        </p>
      </div>
      <div className="flex-1 w-full">
        <SettingsForm />
      </div>
    </div>
  );
}
