"use client";

import { Typography } from "@/components/ui/Typography";
import { HiCheckCircle } from "react-icons/hi2";

const CHAINS = [
    { name: "Ethereum", color: "#627eea" },
    { name: "Base", color: "#0052ff" },
    { name: "Arbitrum", color: "#28a0f0" },
    { name: "Polygon", color: "#8247e5" },
    { name: "Optimism", color: "#ff0420" },
];

export function SupportedChains() {
    return (
        <section className="py-8 lg:py-12 overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <Typography variant="h2" align="center" className="mb-4">
                    Extensive <span className="bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] bg-clip-text text-transparent">Multi-Chain</span> Support
                </Typography>
                <Typography variant="body" align="center" className="text-[#E5E5CB]/60 max-w-xl mx-auto">
                    Buy gas credits for any network and settle instantly on any supported chains.
                </Typography>
            </div>

            {/* Unique Scrolling Marquee */}
            <div className="relative flex overflow-x-hidden">
                <div className="flex animate-marquee whitespace-nowrap py-4">
                    {[...CHAINS, ...CHAINS].map((chain, index) => (
                        <div
                            key={`${chain.name}-${index}`}
                            className="mx-4 flex items-center gap-4 px-8 py-5 rounded-2xl bg-[#3C2A21]/30 border border-[#D5CEA3]/10 backdrop-blur-md hover:border-[#D5CEA3]/40 hover:bg-[#3C2A21]/50 transition-all duration-500 group"
                        >
                            <div
                                className="w-4 h-4 rounded-full shadow-[0_0_15px_currentColor]"
                                style={{ color: chain.color, backgroundColor: 'currentColor' }}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-[#E5E5CB] group-hover:text-white transition-colors">
                                    {chain.name}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-[#D5CEA3]/40 font-semibold group-hover:text-[#D5CEA3]/70 transition-colors">
                                    Instant Settlement
                                </span>
                            </div>
                            <HiCheckCircle className="w-5 h-5 text-[#D5CEA3] opacity-30 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Left/Right Gradient Fades */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#1A120B] via-transparent to-[#1A120B] z-10" />
            </div>

            {/* Custom Animation Style */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
