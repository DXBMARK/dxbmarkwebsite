import type { NextConfig } from "next";

// ─── Security Headers ────────────────────────────────────────────────────────
// Applied to all routes. Designed for dxbmark.com on Cloudflare.
// HSTS is intentionally omitted — managed by Cloudflare SSL/TLS dashboard.
//
// payment=(self "https://js.stripe.com") — allows Stripe Payment Request API
// (Apple Pay, Google Pay buttons via Stripe). Never use payment=() as it
// disables browser payment widgets entirely.

const securityHeaders = [
  // Prevent MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent clickjacking via iframes — also enforced by CSP frame-ancestors
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Control referrer information sent cross-origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict access to browser APIs — payment allows Stripe/Apple Pay/Google Pay
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")',
  },
];

// ─── Content Security Policy ─────────────────────────────────────────────────
// Controlled starting point — safe for Next.js App Router.
//
// External services included:
//   • Adobe Fonts (use.typekit.net / p.typekit.net)
//   • Cookiebot CMP (consent.cookiebot.com / imgsct.cookiebot.com)
//   • Cloudflare Analytics (static.cloudflareinsights.com)
//   • Stripe.js (js.stripe.com / m.stripe.com / q.stripe.com)
//
// 'unsafe-inline' in script-src: required by Next.js inline hydration scripts.
// 'unsafe-eval' in script-src: React dev mode requires eval() to reconstruct
//   callstacks. Included ONLY in development; stripped from production build.
//
// To harden further in future: replace 'unsafe-inline' with a nonce strategy.

const isDev = process.env.NODE_ENV === "development";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""}
    https://consent.cookiebot.com
    https://consentcdn.cookiebot.com
    https://static.cloudflareinsights.com
    https://js.stripe.com
    https://www.googletagmanager.com
    https://connect.facebook.net
    https://snap.licdn.com
    https://vercel.live;
  style-src 'self' 'unsafe-inline'
    https://consent.cookiebot.com
    https://consentcdn.cookiebot.com;
  font-src 'self' data:;
  img-src 'self' data: blob:
    https://www.facebook.com
    https://*.ads.linkedin.com
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://www.linkedin.com
    https://consent.cookiebot.com
    https://consentcdn.cookiebot.com
    https://vercel.live;
  connect-src 'self'
    https://consent.cookiebot.com
    https://consentcdn.cookiebot.com
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://analytics.google.com
    https://connect.facebook.net
    https://www.facebook.com
    https://*.ads.linkedin.com
    https://snap.licdn.com
    https://vercel.live
    wss://vercel.live;
  frame-src 'self'
    https://js.stripe.com
    https://hooks.stripe.com
    https://consent.cookiebot.com
    https://consentcdn.cookiebot.com
    https://www.googletagmanager.com
    https://vercel.live;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self' https://consent.cookiebot.com;
`
  .replace(/\s{2,}/g, " ")
  .trim();

// ─── Next.js Config ──────────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  transpilePackages: ["antd", "antd-style", "@lobehub/ui", "@lobehub/icons"],

  async redirects() {
    return [
      {
        source: "/legal/delivery-and-fulfillment-policy",
        destination: "/legal/delivery-fulfillment",
        permanent: true,
      },
      {
        source: "/legal/dmca",
        destination: "/legal/dmca-policy",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
