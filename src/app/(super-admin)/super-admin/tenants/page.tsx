"use client";

import { TenantsPageTemplate } from "@/features/tenants/components/TenantsPageTemplate";

export default function SuperAdminTenantsPage() {
  return (
    <TenantsPageTemplate
      title="Platform Tenants"
      description="Manage institution tenants and their associated admin accounts."
    />
  );
}
