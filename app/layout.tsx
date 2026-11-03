import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "MeterLog - On-chain Electricity Meter Tracking",
  description:
    "Lightweight, secure on-chain electricity meter reading and consumption tracker on Botchain Testnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-charcoal-900 text-charcoal-100 antialiased selection:bg-accent/20 selection:text-accent-bright min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

