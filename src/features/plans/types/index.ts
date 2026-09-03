export interface PlanFeatures {
  hostel: boolean;
  grading: boolean;
  library: boolean;
  reports: boolean;
  apiAccess: boolean;
  timetable: boolean;
  transport: boolean;
  attendance: boolean;
  parentPortal: boolean;
  customReports: boolean;
  onlineClasses: boolean;
  examManagement: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMonthly: string;
  priceYearly: string;
  maxStudents: number | null;
  maxTeachers: number | null;
  maxStorageMb: number;
  features: PlanFeatures;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SubscriptionPlan[];
  timestamp: string;
  path: string;
}
