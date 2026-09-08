"use client";

import React from "react";
import { useSession } from "@/lib/session";
import { TenantDetailsPageTemplate } from "./TenantDetailsPageTemplate";
import { Loader2 } from "lucide-react";

export function MyInstitutionPage() {
  const user = useSession((state) => state.user);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user.tenantId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-[50vh] text-center gap-4">
        <h3 className="text-xl font-bold text-destructive">No Institution Assigned</h3>
        <p className="text-muted-foreground max-w-md">
          Your account is not associated with any institution. Please contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  return <TenantDetailsPageTemplate tenantId={user.tenantId} />;
}
