import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { ui } from "@/lib/i18n/ui";
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
  title: ui.meta.title,
  description: ui.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
