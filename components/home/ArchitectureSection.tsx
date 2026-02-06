"use client";

import { Typography } from "@/components/ui/Typography";
import { HiCircleStack, HiSquare3Stack3D, HiGlobeEuropeAfrica } from "react-icons/hi2";

const STEPS = [
    {
        title: "Sui Oracle",
        description: "Fetches real-time gas prices from supported EVM chains. Uses Sui's high-performance storage to maintain accurate, rapid price feeds that power our pricing model.",
        icon: HiCircleStack,
        accent: "from-[#D5CEA3]/20 to-transparent",
    },
    {
        title: "Uniswap v4 Hooks",
        description: "Core logic lives on Ethereum Sepolia. Custom v4 hooks manage gas credit issuance, dynamic fees based on volatility, and liquidity provision.",
        icon: HiSquare3Stack3D,
        accent: "from-[#D5CEA3]/20 to-transparent",
    },
    {
        title: "Li.Fi Bridge",
        description: "Cross-chain redemption layer. Buy credits on Sepolia, and our LiFi integration lets you redeem them as native gas on supported chains.",
        icon: HiGlobeEuropeAfrica,
        accent: "from-[#D5CEA3]/20 to-transparent",
    }
];

export function ArchitectureSection() {
    return (
        <section className="container mx-auto px-6 py-8 lg:py-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <Typography variant="h2" align="center" className="mb-4">
                        Under the <span className="bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] bg-clip-text text-transparent">Hood</span>
                    </Typography>
                    <Typography variant="bodyLarge" align="center" className="text-[#E5E5CB]/60 max-w-2xl mx-auto">
                        A sophisticated cross-chain architecture built for reliability and speed.
                    </Typography>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#D5CEA3]/30 to-transparent z-0"></div>

                    {STEPS.map((step, index) => (
                        <div
                            key={index}
                            className="relative z-10 bg-[#1A120B]/80 backdrop-blur-md border border-[#D5CEA3]/10 p-8 rounded-3xl group hover:border-[#D5CEA3]/30 transition-all duration-500 shadow-xl"
                        >
                            {/* Inner Glow Accent */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-[#3C2A21] rounded-2xl flex items-center justify-center mb-6 text-[#D5CEA3] border border-[#D5CEA3]/10 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                                    <step.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#E5E5CB] mb-4 group-hover:text-white transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-[#E5E5CB]/60 text-sm leading-relaxed text-justify">
                                    {step.description}
                                </p>
                            </div>

                            {/* Corner Indicator */}
                            <div className="absolute top-4 right-4 text-[#D5CEA3]/20 font-mono text-sm group-hover:text-[#D5CEA3]/50 transition-colors">
                                0{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
