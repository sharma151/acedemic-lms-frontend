'use client';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { ReactNode } from 'react';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const user = useAuthStore((state) => state.user);

  // In a real application, permissions might be a separate array from roles.
  // Here we assume roles/permissions are stored in user.roles for simplicity, 
  // or you could expand the User interface to include permissions.
  const hasPermission = user?.roles.includes(permission) || user?.roles.includes('super-admin');

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
