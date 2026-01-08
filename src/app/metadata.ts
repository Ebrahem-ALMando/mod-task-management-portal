import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "بوابة روابط وزارة الدفاع السورية",
  description: "بوابة رسمية لروابط ومنصات وزارة الدفاع السورية",
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/asset/img/logo_with_bg.png", type: "image/png", sizes: "32x32" },
      { url: "/asset/img/logo_with_bg.png", type: "image/png", sizes: "192x192" },
      { url: "/asset/img/logo_with_bg.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/asset/img/logo_with_bg.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: " روابط وزارة الدفاع" ,
  },
  openGraph: {
    title: "بوابة روابط وزارة الدفاع السورية",
    description: "بوابة رسمية لروابط ومنصات وزارة الدفاع السورية",
    type: "website",
    locale: "ar",
    url: siteUrl,
    siteName: "وزارة الدفاع السورية",
    images: [
      {
        url: "/asset/img/logo_with_bg_sqr.png",
        width: 500,
        height: 500,
        alt: "شعار وزارة الدفاع السورية",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "بوابة روابط وزارة الدفاع السورية",
    description: "بوابة رسمية لروابط ومنصات وزارة الدفاع السورية",
    images: ["/asset/img/logo_with_bg_sqr.png"],
  },
  other: {
    "theme-color": "#054239",
    "mobile-web-app-capable": "yes",
  },
};

