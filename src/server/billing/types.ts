import { PackageAddonRule } from "@/features/pricing/types";

export interface Addon {
  id: string;
  name: string;
  stripePriceEnvKeyUsd?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  stripePriceEnvKey: string;
  addonRules: PackageAddonRule[];
  scope: string[];
  exclusions: string[];
}
