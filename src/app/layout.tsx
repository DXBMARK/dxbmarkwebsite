import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";

const naruSans = localFont({
  src: [
    {
      path: "../assets/fonts/naru-sans/NaruSans-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/fonts/naru-sans/NaruSans-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const utopia = localFont({
  src: "../assets/fonts/utopia/Utopia.woff2",
  variable: "--font-utopia",
  display: "swap",
  preload: true,
});

const siteUrl = "https://www.dxbmark.com";

const title = "DXBMARK LLC — Custom Software, SaaS & Cloud Systems";

const description =
  "DXBMARK LLC builds custom software, SaaS, cloud infrastructure, and digital integrations for modern businesses.";

const ogImage = "https://www.dxbmark.com/og/dxbmark-og-main.jpg";

const ogImageAlt =
  "DXBMARK LLC open graph image showing the brand slogan Build. Scale. Run. with service panels for Custom Software, SaaS, Web Applications, Cloud Infrastructure, Domains, and Integrations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title,
  description,

  applicationName: "DXBMARK LLC",
  authors: [{ name: "DXBMARK LLC", url: siteUrl }],
  creator: "DXBMARK LLC",
  publisher: "DXBMARK LLC",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DXBMARK LLC",
    title,
    description,
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
    title,
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
      className={`h-full antialiased ${naruSans.variable} ${utopia.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://consent.cookiebot.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://consentcdn.cookiebot.com" crossOrigin="anonymous" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="99d6ba11-8ea1-490c-aec8-c4fbd0848d5c"
          data-blockingmode="auto"
          strategy="afterInteractive"
        />
        <Script id="cookiebot-consent-bridge" strategy="afterInteractive">
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

              var consentKey = [
                marketingGranted,
                statisticsGranted,
                preferencesGranted
              ].join('|');

              if (window.__lastCookiebotConsentKey === consentKey) {
                return;
              }

              window.__lastCookiebotConsentKey = consentKey;

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
        <Analytics />
      </body>
    </html>
  );
}
