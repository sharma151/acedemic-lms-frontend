import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AcademicYear, PaginationMetadata } from "../types";
import { AcademicYearFormData } from "../schemas/academics";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

export interface GetAcademicYearsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: AcademicYear[];
  metadata?: PaginationMetadata;
}

export interface GetAcademicYearResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: AcademicYear;
}

export interface GetAcademicYearsParams {
  page?: number;
  limit?: number;
  name?: string;
}

export const getAcademicYears = async (
  params?: GetAcademicYearsParams
): Promise<{ data: AcademicYear[]; metadata?: PaginationMetadata }> => {
  const response = await apiClient.get<GetAcademicYearsResponse>("/academics/years", { params });
  return { data: response.data.data, metadata: response.data.metadata };
};

export const getAcademicYear = async (id: string): Promise<AcademicYear> => {
  const response = await apiClient.get<GetAcademicYearResponse>(`/academics/years/${id}`);
  return response.data.data;
};

export const createAcademicYear = async (data: AcademicYearFormData) => {
  const response = await apiClient.post(`/academics/years`, data);
  return response.data;
};

export const updateAcademicYear = async ({ id, data }: { id: string; data: Partial<AcademicYearFormData> }) => {
  const response = await apiClient.patch(`/academics/years/${id}`, data);
  return response.data;
};

export const useGetAcademicYears = (params?: GetAcademicYearsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACADEMIC_YEARS, params],
    queryFn: () => getAcademicYears(params),
  });
};

export const useGetAcademicYear = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACADEMIC_YEARS, id],
    queryFn: () => getAcademicYear(id!),
    enabled: !!id,
  });
};

export const useCreateAcademicYear = () => {
  return useCustomMutation<AcademicYearFormData, any>({
    queryKey: [[QUERY_KEYS.ACADEMIC_YEARS]],
    service: createAcademicYear,
    successMessage: "Academic year created successfully",
  });
};

export const useUpdateAcademicYear = () => {
  return useCustomMutation<{ id: string; data: Partial<AcademicYearFormData> }, any>({
    queryKey: [[QUERY_KEYS.ACADEMIC_YEARS]],
    service: updateAcademicYear,
    successMessage: "Academic year updated successfully",
  });
};
