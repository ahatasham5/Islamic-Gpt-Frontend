import axios, { type AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api/backend",
  timeout: 300000
});

// Interceptor removed: Auth token is now handled via HTTPOnly cookies sent automatically by the browser

export async function apiRequest<T>(config: AxiosRequestConfig) {
  const response = await api.request<T>(config);

  return response.data;
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;
    
    // Sanitize 500+ Internal Server Errors
    if (status && status >= 500) {
      return "An unexpected server error occurred. Please try again later.";
    }

    if (typeof payload === "string") {
      return payload;
    }

    const detail = payload?.detail;
    const message = payload?.message;

    if (typeof detail === "string") {
      return detail;
    }

    // Handle FastAPI validation array
    if (Array.isArray(detail)) {
      return detail
        .map((item) => item?.msg || "Validation error")
        .filter(Boolean)
        .join(" ");
    }

    if (typeof message === "string") {
      return message;
    }

    // Avoid returning raw JSON strings of backend data
    return "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
