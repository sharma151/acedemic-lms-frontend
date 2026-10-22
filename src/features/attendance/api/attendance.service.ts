import { apiClient } from "@/lib/api-client";
import {
  AttendanceFilterOptions,
  FilterSectionOption,
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

// Helper to unwrap standard backend envelope
function unwrapData<T>(response: { data: any }): T {
  if (response?.data && typeof response.data === "object" && "data" in response.data) {
    return response.data.data as T;
  }
  return response?.data as T;
}

// Helper to determine if a string is a valid UUID
function isUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export const attendanceService = {
  // 1. Filter Options (Academic Year, Class/Grade, Section, Period/Subject)
  getFilterOptions: async (): Promise<AttendanceFilterOptions> => {
    let raw: any;
    try {
      const res = await apiClient.get<any>("/attendance/filters");
      raw = unwrapData<any>(res);
    } catch {
      const res2 = await apiClient.get<any>("/attendance/filter-options");
      raw = unwrapData<any>(res2);
    }

    const rawClasses = Array.isArray(raw?.classes) ? raw.classes : [];
    const classes = rawClasses.map((c: any) => ({
      id: c.id,
      name: c.name?.startsWith("Grade") ? c.name : `Grade ${c.name}`,
    }));

    // Extract sections whether flat or nested inside classes
    let sections: FilterSectionOption[] = [];
    if (Array.isArray(raw?.sections) && raw.sections.length > 0) {
      sections = raw.sections;
    } else {
      for (const cls of rawClasses) {
        if (Array.isArray(cls.sections)) {
          for (const s of cls.sections) {
            sections.push({
              id: s.id,
              classId: cls.id,
              name: s.name,
            });
          }
        }
      }
    }

    const periods = (Array.isArray(raw?.periods) ? raw.periods : []).map((p: any) => ({
      id: p.id,
      name: p.name || p.code || "Period",
      startTime: p.startTime,
      endTime: p.endTime,
    }));

    return {
      classes,
      sections,
      periods,
      defaultClassId: classes[0]?.id,
      defaultSectionId: sections[0]?.id,
      defaultPeriodId: periods[0]?.id,
    };
  },

  // 2. Daily Register & Student Roster
  getRegister: async (params: {
    class_id?: string;
    classId?: string;
    section_id?: string;
    sectionId?: string;
    date: string;
    period_id?: string | null;
    periodId?: string | null;
  }): Promise<AttendanceRegisterResponse> => {
    const classId = params.classId || params.class_id;
    const sectionId = params.sectionId || params.section_id;
    const periodId = params.periodId || params.period_id;

    if (!classId || !isUuid(classId)) {
      return {
        classId: classId || "",
        sectionId: sectionId || "",
        date: params.date,
        isLocked: false,
        students: [],
      };
    }

    const queryParams: Record<string, string> = {
      date: params.date,
      classId,
    };
    if (sectionId) queryParams.sectionId = sectionId;
    if (periodId && isUuid(periodId)) queryParams.periodId = periodId;

    const res = await apiClient.get<any>("/attendance/register", {
      params: queryParams,
    });
    const raw = unwrapData<any>(res);

    const students = (raw?.students || []).map((s: any) => {
      const parts = (s.name || "").split(" ");

      let approvedLeave: any = null;
      if (s.approvedLeave) {
        if (typeof s.approvedLeave === "object") {
          const rawType = s.approvedLeave.type;
          const leaveTypeStr =
            typeof rawType === "object"
              ? rawType?.type || rawType?.name || rawType?.title || "Leave"
              : typeof rawType === "string"
              ? rawType
              : "Leave";
          const leaveStatus =
            typeof s.approvedLeave.status === "string"
              ? s.approvedLeave.status
              : typeof s.approvedLeave.status === "object"
              ? s.approvedLeave.status?.status || "APPROVED"
              : "APPROVED";
          approvedLeave = {
            leaveId: String(s.approvedLeave.id || s.approvedLeave.leaveId || "leave"),
            type: leaveTypeStr,
            status: leaveStatus,
          };
        }
      } else if (s.leaveNotice) {
        const rawNotice = s.leaveNotice;
        const leaveTypeStr =
          typeof rawNotice === "object"
            ? rawNotice?.type || rawNotice?.name || rawNotice?.title || "Leave"
            : typeof rawNotice === "string"
            ? rawNotice
            : "Leave";
        const leaveStatus =
          typeof rawNotice === "object" && rawNotice?.status
            ? typeof rawNotice.status === "string"
              ? rawNotice.status
              : "APPROVED"
            : "APPROVED";
        approvedLeave = {
          leaveId: "leave",
          type: leaveTypeStr,
          status: leaveStatus,
        };
      }

      const rawStatus = s.status;
      const statusStr =
        typeof rawStatus === "string"
          ? rawStatus
          : typeof rawStatus === "object"
          ? rawStatus?.status || rawStatus?.type || "PRESENT"
          : "PRESENT";

      return {
        studentId: s.studentId,
        rollNumber: s.rollNumber || s.rollNo || "01",
        firstName: s.firstName || parts[0] || "",
        lastName: s.lastName || parts.slice(1).join(" ") || "",
        avatarUrl: s.avatarUrl,
        status: statusStr,
        remarks: s.remarks || s.note || "",
        approvedLeave,
      };
    });

    return {
      classId: raw?.class?.id || raw?.classId || classId || "",
      className: raw?.class?.name || raw?.className,
      sectionId: raw?.section?.id || raw?.sectionId || sectionId || "",
      sectionName: raw?.section?.name || raw?.sectionName,
      date: raw?.date || params.date,
      periodId: raw?.period?.id || raw?.periodId || periodId,
      periodName: raw?.period?.name || raw?.periodName,
      isLocked: raw?.isSubmitted ?? raw?.isLocked ?? false,
      students,
    };
  },

  // 3. Submit Attendance
  submitAttendance: async (payload: SubmitAttendancePayload | any): Promise<{ message: string }> => {
    const classId = payload.classId || payload.class_id;
    const sectionId = payload.sectionId || payload.section_id;
    const periodId = payload.periodId || payload.period_id;

    const body = {
      date: payload.date,
      classId,
      ...(sectionId ? { sectionId } : {}),
      ...(periodId && isUuid(periodId) ? { periodId } : {}),
      records: (payload.records || []).map((r: any) => ({
        studentId: r.studentId || r.student_id,
        status: r.status,
        note: r.note || r.remarks || null,
      })),
    };

    const res = await apiClient.post<{ message: string }>("/attendance/submit", body);
    return unwrapData<{ message: string }>(res);
  },

  // 4. Student Attendance Summary
  getSummary: async (params?: {
    student_id?: string;
    studentId?: string;
    date_range?: string;
    term_id?: string;
  }): Promise<AttendanceSummary> => {
    const studentId = params?.studentId || params?.student_id;
    const queryParams: Record<string, string> = {};
    if (studentId && isUuid(studentId)) {
      queryParams.studentId = studentId;
    }

    const res = await apiClient.get<any>("/attendance/summary", {
      params: queryParams,
    });
    const raw = unwrapData<any>(res);

    return {
      studentId: raw?.studentId,
      studentName: raw?.studentName,
      className: raw?.className,
      sectionName: raw?.sectionName,
      rollNumber: raw?.rollNumber,
      attendanceRate: raw?.attendanceRate ?? raw?.overallRate ?? 0,
      totalDays: raw?.totalDays ?? 0,
      presentDays: raw?.presentDays ?? raw?.daysPresent ?? 0,
      absentDays: raw?.absentDays ?? raw?.daysAbsent ?? 0,
      lateDays: raw?.lateDays ?? raw?.lateCount ?? 0,
      excusedDays: raw?.excusedDays ?? 0,
    };
  },

  // 5. Subject-Wise Attendance Breakdown
  getSubjectWise: async (params?: {
    student_id?: string;
    studentId?: string;
    term_id?: string;
  }): Promise<SubjectWiseAttendance[]> => {
    const studentId = params?.studentId || params?.student_id;
    const queryParams: Record<string, string> = {};
    if (studentId && isUuid(studentId)) {
      queryParams.studentId = studentId;
    }

    const res = await apiClient.get<any>("/attendance/subject-wise", {
      params: queryParams,
    });
    const raw = unwrapData<any>(res);
    const list = Array.isArray(raw) ? raw : [];
    return list.map((item: any) => ({
      subjectId: item.subjectId || item.id,
      subjectName: item.subjectName || item.name || "Subject",
      classesHeld: item.classesHeld ?? item.totalClasses ?? 0,
      classesAttended: item.classesAttended ?? item.attendedClasses ?? 0,
      percentage: item.percentage ?? item.rate ?? 0,
      status: item.status || "Safe",
    }));
  },

  // 6. Monthly Attendance Calendar Markers
  getCalendar: async (params: {
    student_id?: string;
    studentId?: string;
    month: number;
    year: number;
  }): Promise<CalendarDayAttendance[]> => {
    const studentId = params.studentId || params.student_id;
    const queryParams: Record<string, any> = {
      month: params.month,
      year: params.year,
    };
    if (studentId && isUuid(studentId)) {
      queryParams.studentId = studentId;
    }

    const res = await apiClient.get<any>("/attendance/calendar", {
      params: queryParams,
    });
    const raw = unwrapData<any>(res);
    const events = Array.isArray(raw) ? raw : (raw?.events || []);

    return events.map((e: any) => ({
      date: e.date,
      status: e.status,
      note: e.note,
    }));
  },

  // 7. Leave Requests List
  getLeaveRequests: async (params?: {
    student_id?: string;
    studentId?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<LeaveRequest[]> => {
    const studentId = params?.studentId || params?.student_id;
    const queryParams: Record<string, any> = {};
    if (studentId && isUuid(studentId)) {
      queryParams.studentId = studentId;
    }
    if (params?.status && params.status !== "ALL") {
      queryParams.status = params.status;
    }
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;

    try {
      const res = await apiClient.get<any>("/attendance/leave-requests", {
        params: queryParams,
      });
      const raw = unwrapData<any>(res);
      let list: any[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (Array.isArray(raw?.data)) {
        list = raw.data;
      } else if (Array.isArray(raw?.leaveRequests)) {
        list = raw.leaveRequests;
      } else if (Array.isArray(raw?.items)) {
        list = raw.items;
      } else if (Array.isArray(raw?.records)) {
        list = raw.records;
      } else if (Array.isArray(raw?.requests)) {
        list = raw.requests;
      }

      return list.map((l: any) => {
        const studentObj = (l && typeof l.student === "object") ? l.student : {};
        const studentName =
          l?.studentName ||
          (studentObj?.firstName
            ? `${studentObj.firstName} ${studentObj.lastName || ""}`.trim()
            : studentObj?.name) ||
          l?.name ||
          "Student";

        const reviewerObj = (l && typeof l.reviewer === "object") ? l.reviewer : (l?.reviewedByUser || {});
        const reviewerName =
          l?.reviewedBy ||
          (reviewerObj?.firstName
            ? `${reviewerObj.firstName} ${reviewerObj.lastName || ""}`.trim()
            : reviewerObj?.name);

        return {
          id: String(l?.id || l?.leaveId || ""),
          studentId: String(l?.studentId || studentObj?.id || ""),
          studentName: String(studentName),
          studentAvatar: l?.studentAvatar || studentObj?.avatarUrl,
          rollNumber: l?.rollNumber !== undefined ? String(l.rollNumber) : (studentObj?.rollNumber !== undefined ? String(studentObj.rollNumber) : undefined),
          className:
            l?.className ||
            studentObj?.className ||
            studentObj?.class?.name ||
            (typeof l?.class === "string" ? l.class : l?.class?.name),
          sectionName:
            l?.sectionName ||
            studentObj?.sectionName ||
            studentObj?.section?.name ||
            (typeof l?.section === "string" ? l.section : l?.section?.name),
          fromDate: String(l?.fromDate || l?.startDate || ""),
          toDate: String(l?.toDate || l?.endDate || ""),
          leaveType:
            typeof l?.leaveType === "object"
              ? l?.leaveType?.type || l?.leaveType?.name || "General"
              : typeof l?.type === "object"
              ? l?.type?.type || l?.type?.name || "General"
              : String(l?.leaveType || l?.type || "General"),
          reason: String(l?.reason || ""),
          appliedOn: String(l?.appliedOn || l?.createdAt || ""),
          status: (String(l?.status || "PENDING").toUpperCase()) as any,
          reviewNote: l?.reviewNote ? String(l.reviewNote) : (l?.note ? String(l.note) : (l?.remarks ? String(l.remarks) : null)),
          reviewedBy: reviewerName ? String(reviewerName) : null,
          reviewedAt: l?.reviewedAt ? String(l.reviewedAt) : (l?.updatedAt ? String(l.updatedAt) : null),
          documentUrl: l?.documentUrl ? String(l.documentUrl) : null,
        };
      });
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
      return [];
    }
  },

  // 7b. Review (Approve / Reject) Leave Request
  reviewLeaveRequest: async (payload: ReviewLeaveRequestPayload): Promise<LeaveRequest> => {
    const { id, status, reviewNote } = payload;
    const body: { status: "APPROVED" | "REJECTED"; reviewNote?: string } = {
      status,
      ...(reviewNote !== undefined ? { reviewNote } : {}),
    };

    const res = await apiClient.post<any>(`/attendance/leave-requests/${id}/review`, body);
    const raw = unwrapData<any>(res);
    return {
      id: raw?.id || id,
      studentId: raw?.studentId || "",
      studentName: raw?.studentName,
      fromDate: raw?.fromDate || raw?.startDate || "",
      toDate: raw?.toDate || raw?.endDate || "",
      leaveType:
        typeof raw?.leaveType === "object"
          ? raw?.leaveType?.type || raw?.leaveType?.name || "General"
          : typeof raw?.type === "object"
          ? raw?.type?.type || raw?.type?.name || "General"
          : String(raw?.leaveType || raw?.type || "General"),
      reason: raw?.reason || "",
      appliedOn: raw?.appliedOn || raw?.createdAt || "",
      status: (raw?.status?.toUpperCase() || status) as any,
      reviewNote: raw?.reviewNote ?? reviewNote ?? null,
      reviewedBy: raw?.reviewedBy,
      reviewedAt: raw?.reviewedAt,
      documentUrl: raw?.documentUrl,
    };
  },

  // 8. Create Leave Request
  createLeaveRequest: async (payload: CreateLeaveRequestPayload | any): Promise<LeaveRequest> => {
    const studentId = payload.studentId || payload.student_id;
    const body: Record<string, any> = {
      startDate: payload.startDate || payload.from_date,
      endDate: payload.endDate || payload.to_date,
      type: payload.type || payload.leave_type || "General",
      reason: payload.reason,
    };
    if (studentId && isUuid(studentId)) {
      body.studentId = studentId;
    }

    const res = await apiClient.post<any>("/attendance/leave-requests", body);
    const raw = unwrapData<any>(res);
    return {
      id: raw.id || raw.leaveId,
      studentId: raw.studentId || studentId || "",
      fromDate: raw.startDate || body.startDate,
      toDate: raw.endDate || body.endDate,
      leaveType: raw.type || body.type,
      reason: raw.reason || body.reason,
      appliedOn: raw.appliedOn || new Date().toISOString(),
      status: raw.status || "PENDING",
    };
  },

  // 9. Admin Overview Stats
  getOverviewStats: async (date?: string): Promise<AttendanceOverviewStats> => {
    const res = await apiClient.get<any>("/attendance/overview-stats", {
      params: date ? { date } : undefined,
    });
    const raw = unwrapData<any>(res);

    return {
      submittedClassesCount: raw?.submittedClassesCount ?? raw?.submittedCount ?? 0,
      totalClassesCount: raw?.totalClassesCount ?? raw?.totalClasses ?? 0,
      pendingClassesCount: raw?.pendingClassesCount ?? raw?.pendingCount ?? 0,
      totalStudentsEnrolled: raw?.totalStudentsEnrolled ?? raw?.totalStudents ?? 0,
      totalStudentsPresentToday: raw?.totalStudentsPresentToday ?? raw?.presentToday ?? 0,
      schoolAttendanceRate: raw?.schoolAttendanceRate ?? raw?.overallAttendanceRate ?? 0,
    };
  },

  // 10. Admin Daily Submission Matrix
  getDailyMatrix: async (date?: string): Promise<DailyMatrixRow[]> => {
    const res = await apiClient.get<any>("/attendance/daily-matrix", {
      params: date ? { date } : undefined,
    });
    const raw = unwrapData<any>(res);
    const list = Array.isArray(raw) ? raw : (raw?.data || []);

    return list.map((item: any) => ({
      classId: item.classId,
      className: item.className || "Class",
      sectionId: item.sectionId,
      sectionName: item.sectionName || item.section || "A",
      teacherId: item.teacherId || item.teacher?.id || "",
      teacherName: item.teacherName || item.teacher?.name || "Unassigned",
      teacherAvatar: item.teacherAvatar || item.teacher?.initials,
      totalStudents: item.totalStudents ?? 0,
      presentStudents: item.presentStudents ?? null,
      status: (item.status === "SUBMITTED" || item.status === "Submitted") ? "Submitted" : "Pending",
      submittedAt: item.submittedAt,
    }));
  },

  // 11. Remind Teacher
  remindTeacher: async (payload: RemindTeacherPayload | any): Promise<{ message: string }> => {
    const body = {
      teacherId: payload.teacherId || payload.teacher_id,
      class: payload.class || payload.className || "Grade 10",
      section: payload.section || payload.sectionName || "A",
      date: payload.date || new Date().toISOString().split("T")[0],
    };

    const res = await apiClient.post<{ message: string }>("/attendance/remind-teacher", body);
    return unwrapData<{ message: string }>(res);
  },

  // 12. Chronic Absenteeism List
  getChronicAbsenteeism: async (params?: {
    threshold_percentage?: number;
    thresholdRate?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ChronicAbsenteeismStudent[]> => {
    const res = await apiClient.get<any>("/attendance/chronic-absenteeism", {
      params: {
        thresholdRate: params?.thresholdRate ?? params?.threshold_percentage ?? 75,
        search: params?.search,
      },
    });
    const raw = unwrapData<any>(res);
    const list = Array.isArray(raw) ? raw : (raw?.data || []);

    return list.map((item: any) => ({
      studentId: item.studentId,
      rollNumber: item.rollNumber || item.rollNo || "01",
      studentName: item.studentName || item.name || "",
      className: item.className || (item.class ? item.class.split(" - ")[0] : "Grade 10"),
      sectionName: item.sectionName || (item.class ? item.class.split(" - ")[1] || "A" : "A"),
      absentDays: item.absentDays ?? 0,
      attendancePercentage: item.attendancePercentage ?? item.attendanceRate ?? 0,
      lastPresentDate: item.lastPresentDate || "N/A",
      parentContact: {
        phone: item.parentContact?.phone || item.parent?.phone || "+1 (555) 000 0000",
        email: item.parentContact?.email || item.parent?.email,
      },
    }));
  },

  // 13. Export Chronic Absenteeism CSV
  exportChronicAbsenteeismCsv: async (date?: string): Promise<void> => {
    const exportDate = date || new Date().toISOString().split("T")[0];
    const res = await apiClient.get("/attendance/chronic-absenteeism/export", {
      params: { date: exportDate },
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `chronic_absenteeism_${exportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
