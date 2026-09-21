import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  TimetableConfiguration,
  WorkingDay,
  Period,
  PaginationMetadata,
} from "../types";
import {
  ConfigurationFormData,
  WorkingDayFormData,
  PeriodFormData,
} from "../schemas/timetable";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

import { CreateSlotFormData, UpdateSlotFormData, AssignSubstituteFormData } from "../schemas/timetable";
import { WeeklyMatrixResponse } from "../types";

export interface GetWeeklyMatrixParams {
  academicYearId?: string;
  timetableConfigurationId?: string;
  classId?: string;
  startDate?: string;
  endDate?: string;
}

// --- API Response Interfaces ---

export interface GetConfigurationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: TimetableConfiguration[];
  metadata?: PaginationMetadata;
}

export interface GetConfigurationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: TimetableConfiguration;
}

export interface GetWorkingDaysResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: WorkingDay[];
}

export interface GetPeriodsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: Period[];
}

export interface GetConfigurationsParams {
  page?: number;
  limit?: number;
  academicYearName?: string;
  status?: string;
}

// --- Fetch Functions ---

export const getConfigurations = async (
  params?: GetConfigurationsParams
): Promise<{ data: TimetableConfiguration[]; metadata?: PaginationMetadata }> => {
  const response = await apiClient.get<GetConfigurationsResponse>("/timetable-configurations", { params });
  return { data: response.data.data, metadata: response.data.metadata };
};

export const getConfiguration = async (id: string): Promise<TimetableConfiguration> => {
  const response = await apiClient.get<GetConfigurationResponse>(`/timetable-configurations/${id}`);
  return response.data.data;
};

export const createConfiguration = async (data: ConfigurationFormData) => {
  const response = await apiClient.post(`/timetable-configurations`, data);
  return response.data;
};

export const updateConfiguration = async ({ id, data }: { id: string; data: Partial<ConfigurationFormData> }) => {
  const response = await apiClient.patch(`/timetable-configurations/${id}`, data);
  return response.data;
};

export const deleteConfiguration = async (id: string) => {
  const response = await apiClient.delete(`/timetable-configurations/${id}`);
  return response.data;
};

// Days
export const getWorkingDays = async (configurationId: string): Promise<WorkingDay[]> => {
  const response = await apiClient.get<GetWorkingDaysResponse>(`/timetable-configurations/${configurationId}/days`);
  return response.data.data;
};

export const createWorkingDay = async ({ configurationId, data }: { configurationId: string; data: WorkingDayFormData }) => {
  const response = await apiClient.post(`/timetable-configurations/${configurationId}/days`, data);
  return response.data;
};

export const updateWorkingDay = async ({ configurationId, dayId, data }: { configurationId: string; dayId: string; data: Partial<WorkingDayFormData> }) => {
  const response = await apiClient.patch(`/timetable-configurations/${configurationId}/days/${dayId}`, data);
  return response.data;
};

export const deleteWorkingDay = async ({ configurationId, dayId }: { configurationId: string; dayId: string }) => {
  const response = await apiClient.delete(`/timetable-configurations/${configurationId}/days/${dayId}`);
  return response.data;
};

// Periods
export const getPeriods = async (configurationId: string): Promise<Period[]> => {
  const response = await apiClient.get<GetPeriodsResponse>(`/timetable-configurations/${configurationId}/periods`);
  return response.data.data;
};

export const createPeriod = async ({ configurationId, data }: { configurationId: string; data: PeriodFormData }) => {
  const response = await apiClient.post(`/timetable-configurations/${configurationId}/periods`, data);
  return response.data;
};

export const updatePeriod = async ({ configurationId, periodId, data }: { configurationId: string; periodId: string; data: Partial<PeriodFormData> }) => {
  const response = await apiClient.patch(`/timetable-configurations/${configurationId}/periods/${periodId}`, data);
  return response.data;
};

export const deletePeriod = async ({ configurationId, periodId }: { configurationId: string; periodId: string }) => {
  const response = await apiClient.delete(`/timetable-configurations/${configurationId}/periods/${periodId}`);
  return response.data;
};


// --- React Query Hooks ---

export const useGetConfigurations = (params?: GetConfigurationsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMETABLE_CONFIGURATIONS, params],
    queryFn: () => getConfigurations(params),
  });
};

export const useGetConfiguration = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMETABLE_CONFIGURATIONS, id],
    queryFn: () => getConfiguration(id!),
    enabled: !!id,
  });
};

export const useCreateConfiguration = () => {
  return useCustomMutation<ConfigurationFormData, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATIONS]],
    service: createConfiguration,
    successMessage: "Configuration created successfully",
  });
};

export const useUpdateConfiguration = (id?: string) => {
  return useCustomMutation<{ id: string; data: Partial<ConfigurationFormData> }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATIONS], id ? [QUERY_KEYS.TIMETABLE_CONFIGURATIONS, id] : []],
    service: updateConfiguration,
    successMessage: "Configuration updated successfully",
  });
};

export const useDeleteConfiguration = () => {
  return useCustomMutation<string, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATIONS]],
    service: deleteConfiguration,
    successMessage: "Configuration deleted successfully",
  });
};

// Days Hooks
export const useGetWorkingDays = (configurationId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMETABLE_CONFIGURATION_DAYS, configurationId],
    queryFn: () => getWorkingDays(configurationId!),
    enabled: !!configurationId,
  });
};

export const useCreateWorkingDay = (configurationId?: string) => {
  return useCustomMutation<{ configurationId: string; data: WorkingDayFormData }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATION_DAYS, configurationId || ""]],
    service: createWorkingDay,
    successMessage: "Working day created successfully",
  });
};

export const useUpdateWorkingDay = (configurationId?: string) => {
  return useCustomMutation<{ configurationId: string; dayId: string; data: Partial<WorkingDayFormData> }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATION_DAYS, configurationId || ""]],
    service: updateWorkingDay,
    successMessage: "Working day updated successfully",
  });
};

export const useDeleteWorkingDay = (configurationId?: string) => {
  return useCustomMutation<{ configurationId: string; dayId: string }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATION_DAYS, configurationId || ""]],
    service: deleteWorkingDay,
    successMessage: "Working day deleted successfully",
  });
};

// Periods Hooks
export const useGetPeriods = (configurationId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMETABLE_CONFIGURATION_PERIODS, configurationId],
    queryFn: () => getPeriods(configurationId!),
    enabled: !!configurationId,
  });
};

export const useCreatePeriod = (configurationId?: string) => {
  return useCustomMutation<{ configurationId: string; data: PeriodFormData }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATION_PERIODS, configurationId || ""]],
    service: createPeriod,
    successMessage: "Period created successfully",
  });
};

export const useUpdatePeriod = (configurationId?: string) => {
  return useCustomMutation<{ configurationId: string; periodId: string; data: Partial<PeriodFormData> }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATION_PERIODS, configurationId || ""]],
    service: updatePeriod,
    successMessage: "Period updated successfully",
  });
};

export const useDeletePeriod = (configurationId?: string) => {
  return useCustomMutation<{ configurationId: string; periodId: string }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLE_CONFIGURATION_PERIODS, configurationId || ""]],
    service: deletePeriod,
    successMessage: "Period deleted successfully",
  });
};

// --- Slots API ---

export const getWeeklyMatrix = async (params: GetWeeklyMatrixParams): Promise<WeeklyMatrixResponse> => {
  const response = await apiClient.get<{ data: WeeklyMatrixResponse }>("/timetables/weekly-matrix", { params });
  return response.data.data;
};

export const createTimetableSlot = async (data: CreateSlotFormData) => {
  const response = await apiClient.post("/timetables", data);
  return response.data;
};

export const updateTimetableSlot = async ({ id, data }: { id: string; data: UpdateSlotFormData }) => {
  const response = await apiClient.patch(`/timetables/${id}`, data);
  return response.data;
};

export const deleteTimetableSlot = async (id: string) => {
  const response = await apiClient.delete(`/timetables/${id}`);
  return response.data;
};

export const assignSubstituteTeacher = async ({ id, data }: { id: string; data: AssignSubstituteFormData }) => {
  const response = await apiClient.patch(`/timetables/${id}/substitute`, data);
  return response.data;
};

// Hooks
export const useGetWeeklyMatrix = (params: GetWeeklyMatrixParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TIMETABLES, "weekly-matrix", params],
    queryFn: () => getWeeklyMatrix(params),
    enabled: !!params.classId && !!params.timetableConfigurationId,
  });
};

export const useCreateTimetableSlot = () => {
  return useCustomMutation<CreateSlotFormData, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLES]],
    service: createTimetableSlot,
    successMessage: "Slot assigned successfully",
  });
};

export const useUpdateTimetableSlot = () => {
  return useCustomMutation<{ id: string; data: UpdateSlotFormData }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLES]],
    service: updateTimetableSlot,
    successMessage: "Slot updated successfully",
  });
};

export const useDeleteTimetableSlot = () => {
  return useCustomMutation<string, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLES]],
    service: deleteTimetableSlot,
    successMessage: "Slot deleted successfully",
  });
};

export const useAssignSubstituteTeacher = () => {
  return useCustomMutation<{ id: string; data: AssignSubstituteFormData }, Error>({
    queryKey: [[QUERY_KEYS.TIMETABLES]],
    service: assignSubstituteTeacher,
    successMessage: "Substitute assigned successfully",
  });
};
