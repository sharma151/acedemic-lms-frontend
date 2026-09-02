import { apiClient } from "@/lib/api-client";

export const logoutApi = async (_data?: unknown): Promise<void> => {
  await apiClient.post("/auth/logout");
};
