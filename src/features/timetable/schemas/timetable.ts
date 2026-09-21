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

export const CreateSlotSchema = z.object({
  academicYearId: z.string().min(1, "Academic year is required"),
  timetableConfigurationId: z.string().min(1, "Configuration ID is required"),
  periodId: z.string().min(1, "Period is required"),
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().min(1, "Subject is required"),
  primaryTeacherId: z.string().nullable().optional(),
  secondaryTeacherId: z.string().nullable().optional(),
  tag: z.enum(["Theory", "Practical", "Lab"]).or(z.string()).nullable().optional(),
  startTime: z.string(),
  endTime: z.string(),
  day: z.string(),
  date: z.string().nullable().optional(),
  slot: z.string().min(1, "Slot is required"),
  type: z.enum(["period", "break", "PERIOD", "BREAK"]).default("period"),
  status: z.string().default("active"),
  remark: z.string().nullable().optional(),
});

export type CreateSlotFormData = z.infer<typeof CreateSlotSchema>;

export const UpdateSlotSchema = CreateSlotSchema.omit({
  timetableConfigurationId: true,
  periodId: true,
}).partial();
export type UpdateSlotFormData = z.infer<typeof UpdateSlotSchema>;

export const AssignSubstituteSchema = z.object({
  secondaryTeacherId: z.string().min(1, "Substitute teacher is required"),
  date: z.string().optional(),
});
export type AssignSubstituteFormData = z.infer<typeof AssignSubstituteSchema>;
