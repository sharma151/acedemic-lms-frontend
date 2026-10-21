"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { attendanceService } from "./attendance.service";
import {
  AttendanceFilterOptions,
  AttendanceRegisterResponse,
  SubmitAttendancePayload,
  AttendanceSummary,
  SubjectWiseAttendance,
  CalendarDayAttendance,
  LeaveRequest,
  ReviewLeaveRequestPayload,
  CreateLeaveRequestPayload,
  AttendanceOverviewStats,
  DailyMatrixRow,
  ChronicAbsenteeismStudent,
  RemindTeacherPayload,
} from "../types";

export * from "./attendance.service";

// ==========================================
// TanStack Query Hooks
// ==========================================

export const useAttendanceFilters = () => {
  return useQuery<AttendanceFilterOptions>({
    queryKey: [QUERY_KEYS.ATTENDANCE_FILTERS],
    queryFn: attendanceService.getFilterOptions,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

const isUuid = (str?: string | null): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export const useAttendanceRegister = (
  params: {
    class_id?: string;
    classId?: string;
    section_id?: string;
    sectionId?: string;
    date: string;
    period_id?: string | null;
    periodId?: string | null;
  },
  options?: { enabled?: boolean }
) => {
  const classId = params.classId || params.class_id;
  const sectionId = params.sectionId || params.section_id;

  return useQuery<AttendanceRegisterResponse>({
    queryKey: [QUERY_KEYS.ATTENDANCE_REGISTER, params],
    queryFn: () => attendanceService.getRegister(params),
    enabled:
      Boolean(classId && isUuid(classId) && sectionId && params.date) &&
      (options?.enabled ?? true),
  });
};

export const useAttendanceSummary = (params?: {
  student_id?: string;
  studentId?: string;
  date_range?: string;
  term_id?: string;
}) => {
  return useQuery<AttendanceSummary>({
    queryKey: [QUERY_KEYS.ATTENDANCE_SUMMARY, params],
    queryFn: () => attendanceService.getSummary(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAttendanceSubjectWise = (params?: {
  student_id?: string;
  studentId?: string;
  term_id?: string;
}) => {
  return useQuery<SubjectWiseAttendance[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE_SUBJECT_WISE, params],
    queryFn: () => attendanceService.getSubjectWise(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAttendanceCalendar = (params: {
  student_id?: string;
  studentId?: string;
  month: number;
  year: number;
}) => {
  return useQuery<CalendarDayAttendance[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE_CALENDAR, params],
    queryFn: () => attendanceService.getCalendar(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeaveRequests = (params?: {
  student_id?: string;
  studentId?: string;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<LeaveRequest[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE_LEAVE_REQUESTS, params],
    queryFn: () => attendanceService.getLeaveRequests(params),
  });
};

export const useAttendanceOverviewStats = (date?: string) => {
  return useQuery<AttendanceOverviewStats>({
    queryKey: [QUERY_KEYS.ATTENDANCE_OVERVIEW_STATS, date],
    queryFn: () => attendanceService.getOverviewStats(date),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAttendanceDailyMatrix = (date?: string) => {
  return useQuery<DailyMatrixRow[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE_DAILY_MATRIX, date],
    queryFn: () => attendanceService.getDailyMatrix(date),
    staleTime: 1000 * 60 * 2,
  });
};

export const useChronicAbsenteeism = (params?: {
  threshold_percentage?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery<ChronicAbsenteeismStudent[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE_CHRONIC, params],
    queryFn: () => attendanceService.getChronicAbsenteeism(params),
    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// TanStack Mutation Hooks
// ==========================================

export const useSubmitAttendance = (options?: {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) => {
  return useCustomMutation<SubmitAttendancePayload, { message: string }>({
    queryKey: [
      [QUERY_KEYS.ATTENDANCE_REGISTER],
      [QUERY_KEYS.ATTENDANCE_OVERVIEW_STATS],
      [QUERY_KEYS.ATTENDANCE_DAILY_MATRIX],
    ],
    service: attendanceService.submitAttendance,
    successTitle: "Attendance Submitted",
    successMessage: "Attendance records saved successfully",
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useCreateLeaveRequest = (options?: {
  onSuccess?: (data: LeaveRequest) => void;
  onError?: (err: any) => void;
}) => {
  return useCustomMutation<CreateLeaveRequestPayload, LeaveRequest>({
    queryKey: [
      [QUERY_KEYS.ATTENDANCE_LEAVE_REQUESTS],
      [QUERY_KEYS.ATTENDANCE_REGISTER],
    ],
    service: attendanceService.createLeaveRequest,
    successTitle: "Leave Request Submitted",
    successMessage: "Your leave request was submitted for approval",
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useReviewLeaveRequest = (options?: {
  onSuccess?: (data: LeaveRequest) => void;
  onError?: (err: any) => void;
}) => {
  return useCustomMutation<ReviewLeaveRequestPayload, LeaveRequest>({
    queryKey: [
      [QUERY_KEYS.ATTENDANCE_LEAVE_REQUESTS],
      [QUERY_KEYS.ATTENDANCE_REGISTER],
      [QUERY_KEYS.ATTENDANCE_OVERVIEW_STATS],
      [QUERY_KEYS.ATTENDANCE_DAILY_MATRIX],
    ],
    service: attendanceService.reviewLeaveRequest,
    successTitle: "Leave Request Reviewed",
    successMessage: "Leave request status updated successfully",
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useRemindTeacher = (options?: {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) => {
  return useCustomMutation<RemindTeacherPayload, { message: string }>({
    service: attendanceService.remindTeacher,
    successTitle: "Reminder Sent",
    successMessage: "Notification has been dispatched to the teacher",
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
