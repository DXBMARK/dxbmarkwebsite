import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "DXBMARK LLC - Premium Technical Services",
  description: "Official premium engineering, hosting, cloud systems, automation and IT consultancy solutions by DXBMARK.",
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
