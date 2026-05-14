import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/lib/filters";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Dashboard Avícola México",
  description: "Producción y Consumo Avícola en México (1977–2025)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${syne.variable} ${spaceMono.variable} dark`}
    >
      <body className="min-h-full bg-[#0f1628] text-[#e2e8f0] antialiased">
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
