import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DashboardProvider } from "@/components/providers/dashboard-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EV Analytics Dashboard | Washington State Electric Vehicles",
  description:
    "Comprehensive analytics dashboard for 50,000+ electric vehicles in Washington State. Explore trends, distributions, and insights.",
  keywords: [
    "electric vehicles",
    "EV",
    "analytics",
    "dashboard",
    "Washington State",
    "Tesla",
    "BEV",
    "PHEV",
    "clean energy",
    "electric cars",
    "vehicle data",
  ],
  authors: [{ name: "MapUp Assessment" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://ev-analytics-dashboard.vercel.app",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "EV Analytics Dashboard | Washington State Electric Vehicles",
    description:
      "Comprehensive analytics dashboard for 50,000+ electric vehicles in Washington State.",
    siteName: "EV Analytics Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "EV Analytics Dashboard",
    description:
      "Comprehensive analytics dashboard for electric vehicles in Washington State.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardProvider>{children}</DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
