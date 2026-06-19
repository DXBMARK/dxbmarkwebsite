// Server API error handling utilities
export class APIError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    success: false,
    error: message,
    statusCode: 500,
  };
}
