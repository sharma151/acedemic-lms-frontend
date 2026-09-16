export type AcademicYearStatus = "ACTIVE" | "UPCOMING" | "COMPLETED";

export interface PaginationMetadata {
  totalPage: number;
  totalData: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: AcademicYearStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSection {
  id: string;
  academicYearId: string;
  name: string;
  section?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
}

export interface Subject {
  id: string;
  classId: string;
  name: string;
  code: string;
  description?: string | null;
  teacherId?: string | null;
  teacher?: SubjectTeacher | null;
  class?: { id: string; name: string; section?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}
