export const DATE_FORMATS = {
  DEFAULT: 'MMM DD, YYYY', // Jan 01, 2026
  YMD: 'YYYY-MM-DD', // 2026-01-01
  WITH_TIME: 'DD MMM YYYY, h:mm A', // 01 Jan 2026, 10:30 AM
  MDY_WITH_TIME: 'MMM DD, YYYY hh:mm A', // Jan 01, 2026 10:30 AM
  SHORT_DATE: 'DD/MM/YYYY', // 01/01/2026
  ONLY_TIME: 'hh:mm A', // 10:30 AM
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

export const Role = {
  SUPER_ADMIN: 'Super Admin',
  INSTITUTION_ADMIN: 'Institution Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
  ACCOUNTANT: 'Accountant',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export const TENANT_STATUS = {
  ALL: '--',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;
