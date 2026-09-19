import { z } from "zod";

export const ConfigurationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  isDefault: z.boolean().default(false),
});

export type ConfigurationFormData = z.infer<typeof ConfigurationFormSchema>;

export const WorkingDayFormSchema = z.object({
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  label: z.string().min(1, "Label is required"),
  isWorkingDay: z.boolean().default(true),
  displayOrder: z.number().min(0),
});

export type WorkingDayFormData = z.infer<typeof WorkingDayFormSchema>;

export const PeriodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortName: z.string().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format"),
  type: z.enum(["PERIOD", "BREAK"]).default("PERIOD"),
  displayOrder: z.number().min(0),
});

export type PeriodFormData = z.infer<typeof PeriodFormSchema>;
