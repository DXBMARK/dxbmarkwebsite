import type { Metadata } from "next";

export const SITE_URL = "https://www.dxbmark.com";
export const SITE_NAME = "DXBMARK LLC";

export const ROOT_TITLE =
  "DXBMARK LLC | Custom Software, SaaS & Web Applications";

export const ROOT_DESCRIPTION =
  "DXBMARK LLC builds custom software, SaaS platforms, web applications, automation systems, cloud infrastructure, integrations, dashboards, portals, managed hosting, DevOps support, and technical consulting for global businesses.";

export const HOME_DESCRIPTION =
  "DXBMARK LLC designs and builds custom software, SaaS platforms, web applications, automation systems, cloud infrastructure, integrations, portals, dashboards, managed hosting, DevOps support, and technical consulting for global businesses.";

export const SOCIAL_PROFILE_URLS = [
  "https://linkedin.com/company/dxbmark",
  "https://github.com/dxbmark",
  "https://www.facebook.com/dxbmark",
  "https://www.instagram.com/dxbmarkllc",
  "https://share.google/ukdlkEaeQyY8yI51l",
];

export const absoluteUrl = (path = "/") => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
};

type PageMetadataInput = {
  title: string | { absolute: string };
  description: string;
  path: string;
  openGraphTitle?: string;
  openGraphType?: "website" | "article";
  robots?: Metadata["robots"];
};

export const getMetadataTitleText = (
  title: PageMetadataInput["title"],
  openGraphTitle?: string
) => {
  if (openGraphTitle) {
    return openGraphTitle;
  }

  if (typeof title === "string") {
    return `${title} | ${SITE_NAME}`;
  }

  return title.absolute;
};

export const createPageMetadata = ({
  title,
  description,
  path,
  openGraphTitle,
  openGraphType = "website",
  robots,
}: PageMetadataInput): Metadata => {
  const url = absoluteUrl(path);
  const titleText = getMetadataTitleText(title, openGraphTitle);

  const ogImage = "https://www.dxbmark.com/og/dxbmark-og-main.jpg";
  const ogImageAlt =
    "DXBMARK LLC open graph image showing the brand slogan Build. Scale. Run. with service panels for Custom Software, SaaS, Web Applications, Cloud Infrastructure, Domains, and Integrations.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots,
    openGraph: {
      title: titleText,
      description,
      url,
      siteName: SITE_NAME,
      type: openGraphType,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
  };
};

// TODO: Add a dedicated 1200x630 default OG image asset before setting openGraph.images and twitter.images.
