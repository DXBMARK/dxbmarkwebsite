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

export type AddonCategory =
  | "google"
  | "search"
  | "website_setup"
  | "contact_tools"
  | "content"
  | "extra_services"
  | "commerce";

export interface AddonCopy {
  id: string;
  name: string;
  description?: string; // Optional short helper text
  pricingDisplayMode: "placeholder" | "stripe_synced" | "hidden";
  category: AddonCategory;
}

export interface PackageCopy {
  id: string;
  name: string;
  description: string;
  pricingDisplayMode: "placeholder" | "stripe_synced" | "hidden";
  basePricingCurrency: "USD";
  bestFit: string;
  outcome: string;
  benefits: string[];
  scope: string[]; // Included in this package
  exclusions: string[];
  notes?: string[];
}
