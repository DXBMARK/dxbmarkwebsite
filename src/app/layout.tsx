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

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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
        <Script id="cookiebot-consent-bridge" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){dataLayer.push(arguments);}

            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              personalization_storage: 'denied',
              security_storage: 'granted',
              wait_for_update: 500
            });

            function updateConsentFromCookiebot() {
              var consent = window.Cookiebot && window.Cookiebot.consent ? window.Cookiebot.consent : {};

              var marketingGranted = consent.marketing === true;
              var statisticsGranted = consent.statistics === true;
              var preferencesGranted = consent.preferences === true;

              gtag('consent', 'update', {
                ad_storage: marketingGranted ? 'granted' : 'denied',
                ad_user_data: marketingGranted ? 'granted' : 'denied',
                ad_personalization: marketingGranted ? 'granted' : 'denied',
                analytics_storage: statisticsGranted ? 'granted' : 'denied',
                functionality_storage: preferencesGranted ? 'granted' : 'denied',
                personalization_storage: preferencesGranted ? 'granted' : 'denied',
                security_storage: 'granted'
              });

              window.dataLayer.push({
                event: 'cookiebot_consent_update',
                cookiebot_marketing: marketingGranted,
                cookiebot_statistics: statisticsGranted,
                cookiebot_preferences: preferencesGranted
              });
            }

            window.addEventListener('CookiebotOnConsentReady', updateConsentFromCookiebot);
            window.addEventListener('CookiebotOnAccept', updateConsentFromCookiebot);
            window.addEventListener('CookiebotOnDecline', updateConsentFromCookiebot);
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background-slate text-text-main pt-20" suppressHydrationWarning>
        {GTM_ID && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
            <Script id="gtm" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `}
            </Script>
          </>
        )}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
