// Analytics providers placeholder
export const ANALYTICS_PROVIDERS = {
  GoogleAnalytics: "GA4",
  VercelAnalytics: "Vercel",
} as const;

export type AnalyticsProvider = typeof ANALYTICS_PROVIDERS[keyof typeof ANALYTICS_PROVIDERS];
