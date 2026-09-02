export interface SuccessResponseInterface<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}

export interface MutationResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}
