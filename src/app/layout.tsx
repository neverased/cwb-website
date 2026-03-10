import "./globals.css";
import "highlight.js/styles/github-dark.css";

import type { Metadata } from "next";
import { Fira_Code, Space_Grotesk } from "next/font/google";

const fira_code = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wojciech Bajer | Multimedia, Software, Architecture",
  description:
    "Personal brand site for Wojciech Bajer covering multimedia work, software engineering, application architecture, and product audits.",
  icons: {
    icon: "/favicon.ico",
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
