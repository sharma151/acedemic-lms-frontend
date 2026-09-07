import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout role="superadmin" title="LMS Super Admin">
      {children}
    </DashboardLayout>
  );
}
