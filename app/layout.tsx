import type { Metadata } from "next";
import { BioRhyme, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const bioRhyme = BioRhyme({
  subsets: ["latin"],
  variable: "--font-biorhyme",
  weight: ["200", "300", "400", "700", "800"],
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
    <html lang="en" className="dark h-full">
      <body className={`${spaceGrotesk.variable} ${bioRhyme.variable} antialiased font-sans bg-[#472D2D] text-white min-h-screen min-h-dvh flex flex-col`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
