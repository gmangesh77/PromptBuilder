export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'STREAM_INTERRUPTED';

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
}
