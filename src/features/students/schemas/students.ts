import { z } from "zod";

export const createStudentSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  admissionNumber: z.string().min(1, "Admission number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required",
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  address: z.string().min(1, "Address is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  currentEnrollment: z.object({
    academicYearId: z.string().min(1, "Academic year is required"),
    classId: z.string().min(1, "Class is required"),
    rollNumber: z.coerce.number().min(1, "Roll number is required"),
  }),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  address: z.string().min(1, "Address is required").optional(),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "ALUMNI"]).optional(),
});

export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;

export const promoteStudentSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  classId: z.string().min(1, "Class is required"),
  rollNumber: z.coerce.number().min(1, "Roll number is required"),
  previousYearResult: z.string().optional(),
  remarks: z.string().optional(),
});

export type PromoteStudentFormData = z.infer<typeof promoteStudentSchema>;

export const linkParentSchema = z.object({
  parentUserId: z.string().min(1, "Parent user is required"),
  relationship: z.enum(["FATHER", "MOTHER", "GUARDIAN", "OTHER"], {
    required_error: "Relationship is required",
  }),
  isEmergencyContact: z.boolean().default(false),
  canPickup: z.boolean().default(false),
});

export type LinkParentFormData = z.infer<typeof linkParentSchema>;
