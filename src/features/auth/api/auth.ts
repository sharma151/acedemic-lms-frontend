import { apiClient } from "@/lib/api-client";
import { LoginFormData } from "../schemas/authSchemas";

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
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

export const getAuthMe = async (): Promise<any> => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};
