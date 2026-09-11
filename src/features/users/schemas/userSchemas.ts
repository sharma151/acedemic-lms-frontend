import { z } from "zod";

export const AddUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleName: z.string().min(1, "Role name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type AddUserFormData = z.infer<typeof AddUserSchema>;

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png"];
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  roleName: z.string().min(1, "Role name is required").optional(),
  avatar: z
    .any()
    .optional()
    .refine(
      (file) => !file || !(file instanceof File) || ALLOWED_AVATAR_TYPES.includes(file.type),
      { message: "Only .jpg and .png files are allowed" }
    )
    .refine(
      (file) => !file || !(file instanceof File) || file.size <= MAX_AVATAR_SIZE_BYTES,
      { message: "Avatar must be smaller than 5MB" }
    ),
});

export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;
