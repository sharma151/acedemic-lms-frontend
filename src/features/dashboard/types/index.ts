export interface PendingInstitutionAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface PendingInstitutionSubscription {
  planName?: string;
  planSlug?: string;
  status?: string;
}

export interface PendingInstitutionItem {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  admin?: PendingInstitutionAdmin;
  subscription?: PendingInstitutionSubscription;
}

export interface DashboardPaginationMetadata {
  totalData: number;
  totalPage: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PendingInstitutionsResponse {
  data: PendingInstitutionItem[];
  metadata: DashboardPaginationMetadata;
}

export interface EnrollmentTrendItem {
  label: string;
  newEnrollments: number;
  upgrades: number;
  total: number;
}

export interface EnrollmentTrendsTotals {
  newEnrollments: number;
  upgrades: number;
  combined: number;
}

export interface EnrollmentTrendsData {
  tenantName?: string;
  academicYear?: string;
  monthsCount?: number;
  trends: EnrollmentTrendItem[];
  totals: EnrollmentTrendsTotals;
}

export interface MetricGrowthIndicator {
  total?: number;
  count?: number;
  active?: number;
  activelyEnrolled?: number;
  growthText?: string;
  trend?: "up" | "down" | "neutral" | string;
  trendDirection?: "up" | "down" | "neutral" | string;
  teachers?: number;
  staff?: number;
  breakdown?: {
    teachers?: number;
    staff?: number;
  };
}

export interface AcademicYearSummary {
  id?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface DashboardSummaryData {
  // Direct API response keys
  students_count?: number;
  student_average?: string;
  student_average_trend?: "up" | "down" | "neutral" | string;
  Student_avergae_trend?: "up" | "down" | "neutral" | string;

  facultyAndStaff_count?: number;
  facultyAndStaff_average?: string;
  facultyAndStaff_trend?: "up" | "down" | "neutral" | string;

  pendingOnboarding_count?: number;

  institutions_count?: number;
  tenants_count?: number;
  institution_average?: string;
  tenant_average?: string;
  institution_trend?: string;
  tenant_trend?: string;

  academicYear?: AcademicYearSummary | string;

  // Flexible fallback / legacy keys
  institutions?: MetricGrowthIndicator | number;
  tenants?: MetricGrowthIndicator | number;
  totalTenants?: number;
  totalInstitutions?: number;
  students?: MetricGrowthIndicator | number;
  totalStudents?: number;
  faculty?: MetricGrowthIndicator | number;
  staff?: MetricGrowthIndicator | number;
  facultyAndStaff?: MetricGrowthIndicator | number;
  totalFaculty?: number;
  pending?: MetricGrowthIndicator | number;
  pendingInstitutions?: MetricGrowthIndicator | number;
  pendingApprovals?: MetricGrowthIndicator | number;
  [key: string]: any;
}

export interface GetDashboardSummaryParams {
  compare?: "month" | "year";
  tenantName?: string;
}

export interface GetEnrollmentTrendsParams {
  academicYear?: string;
  tenantName?: string;
  months?: number;
}

export interface GetPendingInstitutionsParams {
  page?: number;
  limit?: number;
}
