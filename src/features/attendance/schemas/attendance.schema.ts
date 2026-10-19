import { z } from "zod";

export const leaveRequestSchema = z
  .object({
    student_id: z.string().min(1, "Student is required"),
    from_date: z.string().min(1, "From date is required"),
    to_date: z.string().min(1, "To date is required"),
    leave_type: z.string().min(1, "Leave type is required"),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
    document_url: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.from_date || !data.to_date) return true;
      return new Date(data.to_date) >= new Date(data.from_date);
    },
    {
      message: "End date must be on or after start date",
      path: ["to_date"],
    }
  );

export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

export const attendanceFilterSchema = z.object({
  academic_year_id: z.string().optional(),
  class_id: z.string().min(1, "Class is required"),
  section_id: z.string().min(1, "Section is required"),
  period_id: z.string().optional().nullable(),
  date: z.string().min(1, "Date is required"),
});

export type AttendanceFilterFormData = z.infer<typeof attendanceFilterSchema>;
