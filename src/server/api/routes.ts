// Server API routes placeholder configuration
export const API_ROUTES = {
  CONTACT: "/api/contact",
  LEAD_STATUS: "/api/lead-status",
} as const;

export type APIRoute = typeof API_ROUTES[keyof typeof API_ROUTES];
