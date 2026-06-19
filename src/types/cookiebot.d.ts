declare global {
  interface Window {
    Cookiebot?: {
      renew: () => void;
    };
  }
}

export {};
