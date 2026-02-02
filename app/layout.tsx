import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "InvestingAs | Buy Tomorrow's Gas at Today's Prices",
  description: "Lock in current gas prices for future blockchain transactions. Save up to 90% on Ethereum, Base, Arbitrum, and Polygon gas fees.",
  keywords: ["gas futures", "ethereum", "DeFi", "gas savings", "blockchain", "crypto"],
  openGraph: {
    title: "InvestingAs - Gas Futures Marketplace",
    description: "Never overpay for gas again. Lock in today's prices for future transactions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
