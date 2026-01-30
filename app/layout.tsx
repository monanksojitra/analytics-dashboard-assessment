import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EV Analytics Dashboard | Electric Vehicle Population Insights",
  description:
    "Comprehensive analytics dashboard visualizing Electric Vehicle population data across Washington State. Explore EV adoption trends, geographic distribution, and key metrics.",
  keywords: [
    "electric vehicles",
    "EV analytics",
    "data visualization",
    "Washington State",
    "Tesla",
    "BEV",
    "PHEV",
  ],
  authors: [{ name: "MapUp Assessment" }],
  openGraph: {
    title: "EV Analytics Dashboard",
    description:
      "Explore Electric Vehicle population data with interactive visualizations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
