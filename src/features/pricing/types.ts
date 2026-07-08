export type AddonRequirement = "included" | "required" | "optional";

export type CoveragePeriod =
  | "one_time"
  | "first_year"
  | "ongoing"
  | "not_included";

export type RenewalPolicy =
  | "none"
  | "client_responsibility"
  | "separate_renewal_required"
  | "subscription_available_later";

export interface PackageAddonRule {
  addonId: string;
  requirement: AddonRequirement;
  coveragePeriod?: CoveragePeriod;
  renewalPolicy?: RenewalPolicy;
  note?: string;
}

export interface AddonCopy {
  id: string;
  name: string;
  pricingDisplayMode: "placeholder" | "stripe_synced" | "hidden";
}

export interface PackageCopy {
  id: string;
  name: string;
  description: string;
  pricingDisplayMode: "placeholder" | "stripe_synced" | "hidden";
  basePricingCurrency: "USD";
  scope: string[]; // Included in this package
  exclusions: string[];
  notes?: string[];
}
