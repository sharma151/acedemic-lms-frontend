import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TenantPortalLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="tenant" title="Tenant Portal">
      {children}
    </DashboardLayout>
  );
}
