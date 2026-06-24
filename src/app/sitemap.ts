import type { MetadataRoute } from "next";
import { LEGAL_DOCUMENTS } from "@/content/legal";
import { absoluteUrl } from "@/lib/seo/site";

const staticRoutes = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    path: "/services",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/contact",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/legal",
    changeFrequency: "monthly",
    priority: 0.5,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const legalEntries = LEGAL_DOCUMENTS.map((doc) => ({
    url: absoluteUrl(doc.href),
    lastModified: doc.lastUpdated,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [...staticEntries, ...legalEntries];
}
