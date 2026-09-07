'use client';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { ReactNode } from 'react';
import { Role } from '@/configs/constants';

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const user = useAuthStore((state) => state.user);

  // Check if the user has the required role/permission
  const hasRole = Array.isArray(user?.role) 
    ? user.role.includes(permission) || user.role.includes(Role.SUPER_ADMIN) || user.role.includes('super-admin')
    : user?.role === permission || user?.role === Role.SUPER_ADMIN || user?.role === 'super-admin';

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
