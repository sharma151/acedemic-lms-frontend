export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ClassSubmissionStatus = "Submitted" | "Pending" | "Draft";
export type SubjectAttendanceHealth = "Safe" | "Warning" | "Danger";
export type AttendanceRole = "Teacher" | "Student" | "Admin";

// 1. Cascading Filters
export interface FilterClassOption {
  id: string;
  name: string;
}

export interface FilterSectionOption {
  id: string;
  classId: string;
  name: string;
}

export interface FilterPeriodOption {
  id: string;
  name: string;
  periodNumber?: number;
  subjectName?: string;
  startTime?: string;
  endTime?: string;
}

export interface AttendanceFilterOptions {
  academicYears?: { id: string; name: string; isCurrent: boolean }[];
  classes: FilterClassOption[];
  sections: FilterSectionOption[];
  periods: FilterPeriodOption[];
  defaultClassId?: string;
  defaultSectionId?: string;
  defaultPeriodId?: string;
}

// 2. Class Register
export interface ApprovedLeaveBadge {
  leaveId: string;
  type: string;
  status: "APPROVED";
}

export interface AttendanceStudentRow {
  studentId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  status: AttendanceStatus;
  remarks?: string;
  approvedLeave?: ApprovedLeaveBadge | null;
}

export interface AttendanceRegisterResponse {
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  date: string;
  periodId?: string | null;
  periodName?: string;
  isLocked: boolean;
  students: AttendanceStudentRow[];
}

export interface SubmitAttendanceRecord {
  student_id: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface SubmitAttendancePayload {
  class_id: string;
  section_id: string;
  date: string;
  period_id?: string | null;
  records: SubmitAttendanceRecord[];
}

// 3. Student/Parent Summary & Analytics
export interface AttendanceSummary {
  studentId?: string;
  studentName?: string;
  className?: string;
  sectionName?: string;
  rollNumber?: string;
  attendanceRate: number; // e.g. 84.2
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
}

export interface SubjectWiseAttendance {
  subjectId: string;
  subjectName: string;
  classesHeld: number;
  classesAttended: number;
  percentage: number;
  status: SubjectAttendanceHealth;
}

export interface CalendarDayAttendance {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus | "HOLIDAY" | null;
  note?: string;
}

// 4. Leave Request Workflow
export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName?: string;
  fromDate: string;
  toDate: string;
  leaveType: string; // e.g. "Sick", "Casual", "Emergency"
  reason: string;
  appliedOn: string;
  status: LeaveStatus;
  documentUrl?: string | null;
}

export interface CreateLeaveRequestPayload {
  student_id: string;
  from_date: string;
  to_date: string;
  leave_type?: string;
  reason: string;
  document_url?: string | null;
}

// 5. Admin Oversight & Analytics
export interface AttendanceOverviewStats {
  submittedClassesCount: number;
  totalClassesCount: number;
  pendingClassesCount: number;
  totalStudentsEnrolled: number;
  totalStudentsPresentToday: number;
  schoolAttendanceRate: number;
}

export interface DailyMatrixRow {
  classId: string;
  className: string;
  sectionId?: string;
  sectionName: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  totalStudents: number;
  presentStudents: number | null;
  status: ClassSubmissionStatus;
  submittedAt?: string | null;
}

export interface ChronicAbsenteeismStudent {
  studentId: string;
  rollNumber: string;
  studentName: string;
  className: string;
  sectionName: string;
  absentDays: number;
  attendancePercentage: number;
  lastPresentDate: string;
  parentContact: {
    phone: string;
    email?: string;
  };
}

export interface RemindTeacherPayload {
  teacher_id?: string;
  teacherId?: string;
  class_id?: string;
  class?: string;
  className?: string;
  section?: string;
  date: string;
}
