import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Club Floor — Venue management",
  description: "Nightclub operations: staff, services, and consumption tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
