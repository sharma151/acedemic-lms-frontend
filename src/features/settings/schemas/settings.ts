import { z } from "zod";

export const settingsSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
  academicSession: z.string().min(1, "Academic Session is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Contact Phone is required"),
  address: z.string().min(1, "Address is required"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
