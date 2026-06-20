import type { Metadata } from "next";
import { Inter, Manrope, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["500"],
});

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
      className={`${inter.variable} ${manrope.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/dir8qmj.css" />
      </head>
      <body className="min-h-full flex flex-col bg-background-slate text-text-main pt-20" suppressHydrationWarning>
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="99d6ba11-8ea1-490c-aec8-c4fbd0848d5c"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
