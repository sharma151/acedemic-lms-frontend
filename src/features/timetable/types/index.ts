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

export interface TimetableSlot {
  id: string;
  academicYearId: string;
  timetableConfigurationId: string;
  periodId: string;
  classId: string;
  subjectId: string;
  primaryTeacherId?: string | null;
  secondaryTeacherId?: string | null;
  substituteTeacherId?: string | null;
  tag?: "Theory" | "Practical" | "Lab" | string | null;
  startTime: string;
  endTime: string;
  day: string;
  date?: string | null;
  slot?: string | null;
  type: PeriodType;
  status: string;
  remark?: string | null;
  
  // Relations
  subject?: { id: string; name: string; code?: string };
  primaryTeacher?: { id: string; firstName: string; lastName: string };
  secondaryTeacher?: { id: string; firstName: string; lastName: string };
  substituteTeacher?: { id: string; firstName: string; lastName: string };
  teacher?: { id: string; name: string; avatarUrl?: string; isSubstitute?: boolean };
  class?: { id: string; name: string; section?: string };
}

export interface DayMatrix {
  day: string;
  date: string;
  totalPeriods: number;
  periods: Period[];
}

export interface WeeklyMatrixResponse {
  class: { id: string; name: string; section?: string };
  academicYear: { id: string; name: string };
  configuration: TimetableConfiguration;
  configDays: WorkingDay[];
  configPeriods: Period[];
  days: DayMatrix[];
  slots: TimetableSlot[];
}
