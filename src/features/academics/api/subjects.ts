import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Subject, PaginationMetadata } from "../types";
import { SubjectFormData, AssignTeacherFormData } from "../schemas/academics";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

// ─── Response Interfaces ──────────────────────────────────────────────────────

export interface GetSubjectsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Subject[];
  metadata?: PaginationMetadata;
}

export interface GetSubjectResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Subject;
}

export interface GetSubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
}

// ─── API Service Functions ────────────────────────────────────────────────────

//create subject
export const createSubject = async (data: SubjectFormData) => {
  const response = await apiClient.post("/academics/subjects", data);
  return response.data;
};

//get subjects
export const getSubjects = async (
  params?: GetSubjectsParams,
): Promise<{ data: Subject[]; metadata?: PaginationMetadata }> => {
  const response = await apiClient.get<GetSubjectsResponse>(
    "/academics/subjects",
    { params },
  );
  return { data: response.data.data, metadata: response.data.metadata };
};

//get subjects by class
export const getSubjectsByClass = async (
  classId: string,
  params?: Omit<GetSubjectsParams, "classId">,
): Promise<{ data: Subject[]; metadata?: PaginationMetadata }> => {
  const response = await apiClient.get<GetSubjectsResponse>(
    `/academics/classes/${classId}/subjects`,
    { params },
  );
  return { data: response.data.data, metadata: response.data.metadata };
};

//update subject
export const updateSubject = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<SubjectFormData>;
}) => {
  const response = await apiClient.patch(`/academics/subjects/${id}`, data);
  return response.data;
};
//delete subject
export const deleteSubject = async (id: string) => {
  const response = await apiClient.delete(`/academics/subjects/${id}`);
  return response.data;
};
//assign teacher to subject
export const assignTeacher = async ({
  id,
  data,
}: {
  id: string;
  data: AssignTeacherFormData;
}) => {
  const response = await apiClient.patch(
    `/academics/subjects/${id}/teacher`,
    data,
  );
  return response.data;
};

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export const useGetSubjects = (params?: GetSubjectsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACADEMIC_SUBJECTS, params],
    queryFn: () => getSubjects(params),
  });
};

export const useGetSubjectsByClass = (
  classId: string,
  params?: Omit<GetSubjectsParams, "classId">,
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACADEMIC_SUBJECTS, "class", classId, params],
    queryFn: () => getSubjectsByClass(classId, params),
    enabled: !!classId,
  });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useCreateSubject = () => {
  return useCustomMutation<SubjectFormData, any>({
    queryKey: [[QUERY_KEYS.ACADEMIC_SUBJECTS]],
    service: createSubject,
    successTitle: "Subject Created",
    successMessage: "Subject created successfully",
  });
};

export const useUpdateSubject = () => {
  return useCustomMutation<{ id: string; data: Partial<SubjectFormData> }, any>(
    {
      queryKey: [[QUERY_KEYS.ACADEMIC_SUBJECTS]],
      service: updateSubject,
      successTitle: "Subject Updated",
      successMessage: "Subject updated successfully",
    },
  );
};

export const useDeleteSubject = () => {
  return useCustomMutation<string, any>({
    queryKey: [[QUERY_KEYS.ACADEMIC_SUBJECTS]],
    service: deleteSubject,
    successTitle: "Subject Deleted",
    successMessage: "Subject deleted successfully",
  });
};

export const useAssignTeacher = () => {
  return useCustomMutation<{ id: string; data: AssignTeacherFormData }, any>({
    queryKey: [[QUERY_KEYS.ACADEMIC_SUBJECTS]],
    service: assignTeacher,
    successTitle: "Teacher Assigned",
    successMessage: "Teacher assignment updated successfully",
  });
};
