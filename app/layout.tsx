import type { Metadata } from "next";
import { BioRhyme, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GasTicker } from "@/components/GasTicker";

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
  description: "Lock in current gas prices for future blockchain transactions. Save up to 90% on Sepolia, Base Sepolia, Arbitrum Sepolia, and Optimism Sepolia gas fees.",
  keywords: ["gas futures", "ethereum", "sepolia", "DeFi", "gas savings", "blockchain", "crypto"],
  openGraph: {
    title: "InvestingAs - Gas Futures Marketplace",
    description: "Never overpay for gas again. Lock in today's prices for future transactions.",
    type: "website",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${spaceGrotesk.variable} ${bioRhyme.variable} antialiased font-sans bg-background text-foreground min-h-screen min-h-dvh flex flex-col`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'rgba(18, 18, 18, 0.7)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#E5E5CB',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                },
              }}
              theme="dark"
            />
            <Navbar />
            <GasTicker />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
