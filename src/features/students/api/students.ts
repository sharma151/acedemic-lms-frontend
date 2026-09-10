import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { QUERY_KEYS } from "@/configs/querykey";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import {
  Student,
  StudentHistory,
  GetStudentsFilters,
  CreateStudentPayload,
  UpdateStudentPayload,
  PromoteStudentPayload,
  LinkParentPayload,
} from "../types";

export interface PaginationMetadata {
  totalPage: number;
  totalData: number;
  perPage: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface GetStudentsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Student[];
  metadata?: PaginationMetadata;
}

export interface GetStudentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Student;
}

export interface GetStudentHistoryResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: StudentHistory[];
}

// --- API Functions ---

export const getStudents = async (
  filters?: GetStudentsFilters,
): Promise<{ data: Student[]; metadata?: PaginationMetadata }> => {
  const response = await apiClient.get<GetStudentsResponse>("/students", {
    params: filters,
  });
  return { data: response.data.data, metadata: response.data.metadata };
};

export const getStudentDetails = async (id: string): Promise<Student> => {
  const response = await apiClient.get<GetStudentResponse>(`/students/${id}`);
  return response.data.data;
};

export const createStudent = async (data: CreateStudentPayload) => {
  const response = await apiClient.post(`/students`, data);
  return response.data;
};

export const updateStudent = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateStudentPayload;
}) => {
  const response = await apiClient.patch(`/students/${id}`, data);
  return response.data;
};

export const getStudentHistory = async (
  id: string,
): Promise<StudentHistory[]> => {
  const response = await apiClient.get<GetStudentHistoryResponse>(
    `/students/${id}/history`,
  );
  return response.data.data;
};

export const promoteStudent = async ({
  id,
  data,
}: {
  id: string;
  data: PromoteStudentPayload;
}) => {
  const response = await apiClient.post(`/students/${id}/promote`, data);
  return response.data;
};

export const linkParent = async ({
  id,
  data,
}: {
  id: string;
  data: LinkParentPayload;
}) => {
  const response = await apiClient.post(`/students/${id}/parents`, data);
  return response.data;
};

export const unlinkParent = async ({
  id,
  parentUserId,
}: {
  id: string;
  parentUserId: string;
}) => {
  const response = await apiClient.delete(
    `/students/${id}/parents/${parentUserId}`,
  );
  return response.data;
};

// --- Hooks ---

export const useStudents = (filters: GetStudentsFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, filters],
    queryFn: () => getStudents(filters),
  });
};

export const useStudentDetails = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENT_DETAILS, id],
    queryFn: () => getStudentDetails(id!),
    enabled: !!id,
  });
};

export const useStudentHistory = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENT_HISTORY, id],
    queryFn: () => getStudentHistory(id!),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  return useCustomMutation<CreateStudentPayload, Student>({
    queryKey: [[QUERY_KEYS.STUDENTS]],
    service: createStudent,
    successMessage: "Student registered successfully",
  });
};

export const useUpdateStudent = () => {
  return useCustomMutation<{ id: string; data: UpdateStudentPayload }, Student>({
    queryKey: [[QUERY_KEYS.STUDENTS], [QUERY_KEYS.STUDENT_DETAILS]],
    service: updateStudent,
    successMessage: "Student profile updated successfully",
  });
};

export const usePromoteStudent = (studentId: string) => {
  return useCustomMutation<{ id: string; data: PromoteStudentPayload }, StudentHistory>({
    queryKey: [
      [QUERY_KEYS.STUDENT_HISTORY, studentId],
      [QUERY_KEYS.STUDENT_DETAILS, studentId],
    ],
    service: promoteStudent,
    successMessage: "Student promoted successfully",
  });
};

export const useLinkParent = (studentId: string) => {
  return useCustomMutation<{ id: string; data: LinkParentPayload }, unknown>({
    queryKey: [[QUERY_KEYS.STUDENT_DETAILS, studentId]],
    service: linkParent,
    successMessage: "Parent linked successfully",
  });
};

export const useUnlinkParent = (studentId: string) => {
  return useCustomMutation<{ id: string; parentUserId: string }, unknown>({
    queryKey: [[QUERY_KEYS.STUDENT_DETAILS, studentId]],
    service: unlinkParent,
    successMessage: "Parent unlinked successfully",
  });
};
