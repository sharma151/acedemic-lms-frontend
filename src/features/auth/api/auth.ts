import { apiClient } from "@/lib/api-client";
import { LoginFormData } from "../schemas/authSchemas";

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
    tenantId?: string | null;
  };
};

export const loginWithEmail = async (
  data: LoginFormData,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const logoutApi = async (data?: unknown): Promise<void> => {
  await apiClient.post("/auth/logout", data);
};

export interface AuthUser {
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  firstName: string;
  googleId: string | null;
  id: string;
  isActive: boolean;
  lastLoginAt: string;
  lastName: string;
  role: string;
  roleId: string;
  tenant: { id: string; name: string } | null;
  tenantId: string | null;
  updatedAt: string;
}

export interface AuthMeResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: AuthUser;
}

export const getAuthMe = async (): Promise<AuthMeResponse> => {
  const response = await apiClient.get<AuthMeResponse>("/auth/me");
  return response.data;
};
