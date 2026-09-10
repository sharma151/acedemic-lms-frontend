import { z } from "zod";

export const academicYearSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isCurrent: z.boolean().default(false),
  status: z.enum(["ACTIVE", "UPCOMING", "COMPLETED"]),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;

export const classSectionSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  name: z.string().min(1, "Class name is required"),
  section: z.string().optional(),
});

export type ClassSectionFormData = z.infer<typeof classSectionSchema>;
