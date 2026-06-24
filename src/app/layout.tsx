import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { ROOT_DESCRIPTION, ROOT_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: ROOT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: ROOT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
  },
};

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/dir8qmj.css" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="99d6ba11-8ea1-490c-aec8-c4fbd0848d5c"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background-slate text-text-main pt-20" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
