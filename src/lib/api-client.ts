// API client builder using the fetcher placeholder
import { fetcher } from "./fetcher";

export const apiClient = {
  get: <T>(url: string, params?: Record<string, string>) => 
    fetcher<T>(url, { method: "GET", params }),
    
  post: <T>(url: string, body: unknown) => 
    fetcher<T>(url, { method: "POST", body: JSON.stringify(body) }),
    
  put: <T>(url: string, body: unknown) => 
    fetcher<T>(url, { method: "PUT", body: JSON.stringify(body) }),
    
  delete: <T>(url: string) => 
    fetcher<T>(url, { method: "DELETE" }),
};
