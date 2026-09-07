export interface SuccessResponseInterface<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  metadata?: unknown;
}

export interface MutationResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}
