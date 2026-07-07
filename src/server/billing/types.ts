export interface Addon {
  id: string;
  name: string;
  displayPriceLabelUsd?: string;
  displayPriceLabelAed?: string;
  displayBillingLabel?: string;
  currencyGroup: "USD" | "AED" | "BOTH";
  stripePriceEnvKeyUsd?: string;
  stripePriceEnvKeyAed?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  displayPriceLabel: string;
  displayBillingLabel?: string;
  currencyGroup: "USD" | "AED";
  stripePriceEnvKey: string;
  allowedAddons: string[];
  scope: string[];
  exclusions: string[];
}
