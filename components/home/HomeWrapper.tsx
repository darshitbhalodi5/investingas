"use client";

import { VerifiedContracts } from "@/components/home/VerifiedContracts";
import { CTASection } from "@/components/home/CTASection";
import { SupportedChains } from "@/components/home/SupportedChains";
import { DevelopersSection } from "@/components/home/DevelopersSection";
import { ArchitectureSection } from "@/components/home/ArchitectureSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SavingsPreview } from "@/components/home/SavingsPreview";
import { HeroSection } from "@/components/home/HeroSection";

export default function HomeWrapper() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <SavingsPreview />
            <HowItWorks />
            <ArchitectureSection />
            <DevelopersSection />
            <SupportedChains />
            <CTASection />
            <VerifiedContracts />
        </main>
    );
}
