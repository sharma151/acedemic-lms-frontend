export type StudentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ALUMNI";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type ParentRelationship = "FATHER" | "MOTHER" | "GUARDIAN" | "OTHER";

export interface Student {
  id: string;
  tenantId: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    isActive: boolean;
  };
  admissionNumber: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  address: string;
  emergencyContactPhone: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  
  // Enriched relations (depending on backend, these might be present)
  currentEnrollment?: StudentEnrollment;
  parents?: LinkedParent[];
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  rollNumber: number;
  createdAt: string;
  
  // Relations
  academicYear?: { name: string };
  class?: { name: string, section?: string };
}

export interface LinkedParent {
  id: string;
  studentId: string;
  parentUserId: string;
  relationship: ParentRelationship;
  isEmergencyContact: boolean;
  canPickup: boolean;
  
  // Relations
  parent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface StudentHistory {
  id: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  rollNumber: number;
  status: string; // e.g. PROMOTED, RETAINED, ONGOING
  previousYearResult?: string;
  remarks?: string;
  createdAt: string;
  
  academicYear?: { name: string };
  class?: { name: string, section?: string };
}

export interface CreateStudentPayload {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  address: string;
  emergencyContactPhone: string;
  currentEnrollment: {
    academicYearId: string;
    classId: string;
    rollNumber: number;
  };
}

export interface UpdateStudentPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  admissionNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  address?: string;
  emergencyContactPhone?: string;
  status?: StudentStatus;
}

export interface PromoteStudentPayload {
  academicYearId: string;
  classId: string;
  rollNumber: number;
  previousYearResult?: string;
  remarks?: string;
}

export interface LinkParentPayload {
  parentUserId: string;
  relationship: ParentRelationship;
  isEmergencyContact: boolean;
  canPickup: boolean;
}

export interface GetStudentsFilters {
  page?: number;
  limit?: number;
  search?: string;
  admissionNumber?: string;
  classId?: string;
  academicYearId?: string;
  status?: string;
}
