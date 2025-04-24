export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
  stack?: string[];
}

export interface ValidationErrorResponse {
  message: string;
  details: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpResponse = any;

export interface ErrorHandler {
  handleError: (response: HttpResponse, error: unknown, httpCode: number) => HttpResponse;
}
