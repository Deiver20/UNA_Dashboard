import type { Metadata } from "next";
import { Playfair_Display, Quicksand, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/lib/filters";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${playfair.variable} ${quicksand.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-full antialiased" style={{ background: '#F2F8FF', color: '#1C1C1C' }}>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
