import React from "react";
import { TenantDetailsPageTemplate } from "@/features/tenants/components/TenantDetailsPageTemplate";

export default async function TenantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <TenantDetailsPageTemplate tenantId={id} />
  );
}
