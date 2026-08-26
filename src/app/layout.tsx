import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import { buildMetadata, personJsonLd } from "@/lib/seo";
import "./globals.css";

/**
 * Inter is the closest freely-licensable face to the system font Apple uses;
 * it carries the whole interface, with a mono only for code and IDs.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1c2333" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f14" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-wallpaper="aurora"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Inline and synchronous so the stored theme and wallpaper are applied
          before the first paint, no flash of the wrong desktop.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>

      <body className="h-full">
        {children}
        <script
          type="application/ld+json"
          // Structured data, never executed, the standard Next.js pattern.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
