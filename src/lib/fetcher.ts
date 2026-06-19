// Client-side generic fetcher utility
export interface FetcherOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetcher<T>(url: string, options: FetcherOptions = {}): Promise<T> {
  const { params, ...customConfig } = options;
  
  let targetUrl = url;
  if (params) {
    const searchParams = new URLSearchParams(params);
    targetUrl += `?${searchParams.toString()}`;
  }

  const headers = { "Content-Type": "application/json", ...customConfig.headers };
  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  const response = await fetch(targetUrl, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
