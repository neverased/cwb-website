import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { Fira_Code } from "next/font/google";
import Script from "next/script";

const fira_code = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Consulting Wojciech Bajer",
  description: "Creative agency for the digital age",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={fira_code.className}>{children}
      </body>
    </html>
  );
}
