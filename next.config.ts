import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
