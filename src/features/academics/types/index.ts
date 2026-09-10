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
