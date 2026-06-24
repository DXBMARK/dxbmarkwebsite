import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found/NotFoundContent";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | DXBMARK LLC" },
  description:
    "The requested DXBMARK LLC page could not be found. Return home or contact support.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
