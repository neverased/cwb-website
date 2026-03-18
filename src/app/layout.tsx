import "./globals.css";
import "highlight.js/styles/github-dark.css";

import type { Metadata, Viewport } from "next";
import { Fira_Code, Space_Grotesk } from "next/font/google";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const fira_code = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#041111",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: [...DEFAULT_KEYWORDS],
  authors: [
    {
      name: PERSON_NAME,
      url: SITE_URL,
    },
  ],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fira_code.className} ${space_grotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
