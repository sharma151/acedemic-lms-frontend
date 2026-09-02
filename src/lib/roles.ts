export const Role = {
  SUPER_ADMIN: 'Super Admin',
  INSTITUTION_ADMIN: 'Institution Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
  ACCOUNTANT: 'Accountant',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

/**
 * Foundation for future route-based access control inside the tenant portal.
 * Super Admin implicitly bypasses all restrictions, but specific tenant roles
 * can be tightly scoped here.
 */
export const TenantRoutePermissions: Record<string, RoleType[]> = {
  // Example: '/roles': [Role.INSTITUTION_ADMIN],
  // Example: '/grades': [Role.TEACHER, Role.STUDENT],
};
