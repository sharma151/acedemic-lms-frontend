import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SettingsFormData } from "../schemas/settings";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

export interface GetSettingsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: SettingsFormData;
}

export const getSettings = async (): Promise<SettingsFormData> => {
  const response = await apiClient.get<GetSettingsResponse>(`/settings`);
  return response.data.data;
};

export const updateSettings = async (data: SettingsFormData) => {
  const response = await apiClient.patch(`/settings`, data);
  return response.data;
};

export const useGetSettings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: () => getSettings(),
  });
};

export const useUpdateSettings = () => {
  return useCustomMutation<SettingsFormData, any>({
    queryKey: [[QUERY_KEYS.SETTINGS]],
    service: updateSettings,
    successMessage: "Settings updated successfully",
  });
};
