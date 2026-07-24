export interface IResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface SuccessResponse<T> extends IResponse {
  data: T;
}

export interface ErrorResponse extends IResponse {}
