import { z } from "zod";

export const RoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must not exceed 50 characters"),
  description: z
    .string()
    .max(250, "Description must not exceed 250 characters")
    .optional()
    .or(z.literal("")),
});

export type RoleFormData = z.infer<typeof RoleSchema>;

export const RolePermissionItemSchema = z.object({
  action: z.string().min(1, "Action is required"),
  subject: z.string().min(1, "Subject is required"),
  conditions: z.any().optional(),
});

export const AssignPermissionsSchema = z.object({
  permissions: z.array(RolePermissionItemSchema),
});

export type AssignPermissionsFormData = z.infer<typeof AssignPermissionsSchema>;

/**
 * Standard System Permissions Catalog
 * Grouped logically and directly matching the backend CASL Ability Subjects & Actions:
 * Subjects: Class, Subject, AcademicYear, Student, Teacher, Attendance, Timetable, TimetableConfiguration, User, Role, Dashboard, AuditLog, Fee
 * Actions: manage, create, read, update, delete
 */
export const SYSTEM_PERMISSION_MODULES = [
  {
    module: "Classes",
    description: "Manage classes and section assignments",
    permissions: [
      { code: "read:Class", action: "read", subject: "Class", name: "View Classes", description: "View class sections and rosters" },
      { code: "create:Class", action: "create", subject: "Class", name: "Create Classes", description: "Create new class sections" },
      { code: "update:Class", action: "update", subject: "Class", name: "Edit Classes", description: "Update class info and assignments" },
      { code: "delete:Class", action: "delete", subject: "Class", name: "Delete Classes", description: "Remove class sections" },
    ],
  },
  {
    module: "Subjects & Academic Years",
    description: "Curriculum courses, subjects, and academic year terms",
    permissions: [
      { code: "read:Subject", action: "read", subject: "Subject", name: "View Subjects", description: "View curriculum subjects" },
      { code: "manage:Subject", action: "manage", subject: "Subject", name: "Manage Subjects", description: "Create, edit, or delete subjects" },
      { code: "read:AcademicYear", action: "read", subject: "AcademicYear", name: "View Academic Years", description: "View academic year sessions" },
      { code: "manage:AcademicYear", action: "manage", subject: "AcademicYear", name: "Manage Academic Years", description: "Create and configure academic years" },
    ],
  },
  {
    module: "Attendance",
    description: "Student and staff attendance records and matrix",
    permissions: [
      { code: "read:Attendance", action: "read", subject: "Attendance", name: "View Attendance", description: "View attendance matrix and reports" },
      { code: "create:Attendance", action: "create", subject: "Attendance", name: "Mark Attendance", description: "Record daily/period attendance" },
      { code: "update:Attendance", action: "update", subject: "Attendance", name: "Modify Attendance", description: "Edit attendance and approve leaves" },
      { code: "delete:Attendance", action: "delete", subject: "Attendance", name: "Delete Attendance", description: "Remove attendance entries" },
    ],
  },
  {
    module: "Timetable",
    description: "Weekly timetable schedules and period configurations",
    permissions: [
      { code: "read:Timetable", action: "read", subject: "Timetable", name: "View Timetable", description: "View timetable matrices" },
      { code: "manage:Timetable", action: "manage", subject: "Timetable", name: "Manage Timetable", description: "Assign lesson periods and teachers" },
      { code: "read:TimetableConfiguration", action: "read", subject: "TimetableConfiguration", name: "View Configs", description: "View period and working day setups" },
      { code: "manage:TimetableConfiguration", action: "manage", subject: "TimetableConfiguration", name: "Manage Configs", description: "Configure timetable structures" },
    ],
  },
  {
    module: "Students & Teachers",
    description: "Student profiles, admissions, and teacher management",
    permissions: [
      { code: "read:Student", action: "read", subject: "Student", name: "View Students", description: "View student profiles and records" },
      { code: "manage:Student", action: "manage", subject: "Student", name: "Manage Students", description: "Enroll, edit, and manage students" },
      { code: "read:Teacher", action: "read", subject: "Teacher", name: "View Teachers", description: "View teacher directory" },
      { code: "manage:Teacher", action: "manage", subject: "Teacher", name: "Manage Teachers", description: "Manage teacher assignments" },
    ],
  },
  {
    module: "Users & Accounts",
    description: "Institution user accounts and staff access",
    permissions: [
      { code: "read:User", action: "read", subject: "User", name: "View Users", description: "View institution users directory" },
      { code: "create:User", action: "create", subject: "User", name: "Create Users", description: "Add new user accounts" },
      { code: "update:User", action: "update", subject: "User", name: "Edit Users", description: "Update user accounts and passwords" },
      { code: "delete:User", action: "delete", subject: "User", name: "Delete Users", description: "Deactivate or delete users" },
    ],
  },
  {
    module: "Roles & Security",
    description: "Custom role management and RBAC policy permissions",
    permissions: [
      { code: "read:Role", action: "read", subject: "Role", name: "View Roles", description: "View roles and assigned abilities" },
      { code: "manage:Role", action: "manage", subject: "Role", name: "Manage Roles", description: "Create, update, delete roles & permissions" },
    ],
  },
  {
    module: "Dashboard, Fees & Logs",
    description: "Institution metrics, audit logs, and fee invoicing",
    permissions: [
      { code: "read:Dashboard", action: "read", subject: "Dashboard", name: "View Dashboard", description: "Access campus executive dashboard" },
      { code: "read:AuditLog", action: "read", subject: "AuditLog", name: "View Audit Logs", description: "Inspect system audit trails" },
      { code: "read:Fee", action: "read", subject: "Fee", name: "View Fees", description: "View fee structures and payments" },
      { code: "manage:Fee", action: "manage", subject: "Fee", name: "Manage Fees", description: "Configure fees and invoices" },
    ],
  },
] as const;
