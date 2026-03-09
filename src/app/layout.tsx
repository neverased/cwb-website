import "./globals.css";
import "highlight.js/styles/github-dark.css";

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

export const metadata = {
    title: "Consulting Wojciech Bajer",
    description: "Creative agency for the digital age",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>{metadata.title}</title>
                <meta
                    name="description"
                    content={metadata.description}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    href="/favicon.ico"
                />
            </head>
            <body className={`${fira_code.className} ${space_grotesk.variable}`}>{children}</body>
        </html>
    );
}
