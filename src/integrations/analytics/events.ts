// Analytics events placeholder
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface WindowWithGtag extends Window {
  gtag?: (
    command: "event",
    action: string,
    params: {
      event_category: string;
      event_label?: string;
      value?: number;
    }
  ) => void;
}

export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (typeof window !== "undefined") {
    const win = window as unknown as WindowWithGtag;
    if (win.gtag) {
      win.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      return;
    }
  }
  console.log("[Analytics Event Tracker (Placeholder)]", { action, category, label, value });
}
