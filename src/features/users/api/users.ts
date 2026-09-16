import { apiClient } from "@/lib/api-client";
import { AddUserFormData, UpdateUserFormData } from "../schemas/userSchemas";

export const addUserApi = async (data: AddUserFormData): Promise<unknown> => {
  const response = await apiClient.post("/users", data);
  return response.data;
};

export const updateUserApi = async ({ id, data }: { id: string; data: UpdateUserFormData }): Promise<unknown> => {
  const formData = new FormData();

  // Only append fields that were explicitly provided
  if (data.firstName !== undefined && data.firstName !== "") {
    formData.append("firstName", data.firstName);
  }
  if (data.lastName !== undefined && data.lastName !== "") {
    formData.append("lastName", data.lastName);
  }
  if (data.roleName !== undefined && data.roleName !== "") {
    formData.append("roleName", data.roleName);
  }
  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  const response = await apiClient.patch(`/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteUserApi = async (id: string): Promise<unknown> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
