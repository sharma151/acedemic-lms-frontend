export type TimetableConfigurationStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface PaginationMetadata {
  totalPage: number;
  totalData: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface TimetableConfiguration {
  id: string;
  name: string;
  academicYearId: string;
  academicYear?: {
    id: string;
    name: string;
  };
  status: TimetableConfigurationStatus;
  isDefault: boolean;
  totalDays: number;
  totalPeriods: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingDay {
  id: string;
  configurationId: string;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  label: string;
  isWorkingDay: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type PeriodType = "PERIOD" | "BREAK";

export interface Period {
  id: string;
  configurationId: string;
  name: string;
  shortName?: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  type: PeriodType;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
