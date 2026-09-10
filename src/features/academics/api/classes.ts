import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ClassSection, PaginationMetadata } from "../types";
import { ClassSectionFormData } from "../schemas/academics";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

export interface GetClassSectionsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: ClassSection[];
  metadata?: PaginationMetadata;
}

export interface GetClassSectionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  timestamp: string;
  path: string;
  data: ClassSection;
}

export interface GetClassSectionsParams {
  academicYearId?: string;
  page?: number;
  limit?: number;
  name?: string;
}

export const getClassSections = async (
  params?: GetClassSectionsParams,
): Promise<{ data: ClassSection[]; metadata?: PaginationMetadata }> => {
  const response = await apiClient.get<GetClassSectionsResponse>(
    "/academics/classes",
    { params },
  );
  return { data: response.data.data, metadata: response.data.metadata };
};

export const getClassSection = async (id: string): Promise<ClassSection> => {
  const response = await apiClient.get<GetClassSectionResponse>(
    `/academics/classes/${id}`,
  );
  return response.data.data;
};

export const createClassSection = async (data: ClassSectionFormData) => {
  const response = await apiClient.post(`/academics/classes`, data);
  return response.data;
};

export const updateClassSection = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<ClassSectionFormData>;
}) => {
  const response = await apiClient.patch(`/academics/classes/${id}`, data);
  return response.data;
};

export const useGetClassSections = (params?: GetClassSectionsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACADEMIC_CLASSES, params],
    queryFn: () => getClassSections(params),
  });
};

export const useGetClassSection = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACADEMIC_CLASSES, id],
    queryFn: () => getClassSection(id!),
    enabled: !!id,
  });
};

export const useCreateClassSection = () => {
  return useCustomMutation<ClassSectionFormData, any>({
    queryKey: [[QUERY_KEYS.ACADEMIC_CLASSES]],
    service: createClassSection,
    successMessage: "Class created successfully",
  });
};

export const useUpdateClassSection = () => {
  return useCustomMutation<
    { id: string; data: Partial<ClassSectionFormData> },
    any
  >({
    queryKey: [[QUERY_KEYS.ACADEMIC_CLASSES]],
    service: updateClassSection,
    successMessage: "Class updated successfully",
  });
};
