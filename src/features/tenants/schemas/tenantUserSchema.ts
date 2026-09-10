import { z } from "zod";

export const registerTenantUserSchema = z.object({
  tenantSlug: z.string().min(1, "Tenant slug is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type RegisterTenantUserFormData = z.infer<typeof registerTenantUserSchema>;
