import { apiClient } from '@/lib/api-client';
import { LoginFormData } from '../schemas/authSchemas';

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
};

export const loginWithEmail = async (data: LoginFormData): Promise<LoginResponse> => {
  // Since apiClient base URL is already configured with /api/v1,
  // this will make a request to http://localhost:8888/api/v1/auth/login
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};
