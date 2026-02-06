"use client";

import { HiArrowRight, HiCircleStack, HiGlobeEuropeAfrica, HiSquare3Stack3D, HiIdentification } from "react-icons/hi2";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden min-h-[80vh] flex flex-col justify-center py-8 lg:py-12">
            <div className="container mx-auto px-4 xs:px-6 relative z-10">

                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 xs:px-4 xs:py-2 rounded-full bg-[#3C2A21]/50 border border-[#D5CEA3]/20 backdrop-blur-md animate-[fade-in-down_1s_ease-out] mb-4 lg:mb-6">
                        <span className="text-[10px] xs:text-xs sm:text-sm text-[#E5E5CB]/70 font-medium tracking-wide">First ever gas futures marketplace</span>
                    </div>

                    {/* Main Headline */}
                    <Typography
                        variant="h2"
                        align="center"
                        className="py-2 xs:py-4 lg:py-6 leading-tight tracking-tight px-2"
                    >
                        Buy Tomorrow&apos;s Gas {" "}
                        <span className="bg-gradient-to-r from-[#D5CEA3] via-[#E5E5CB] to-[#D5CEA3] bg-clip-text text-transparent">at Today&apos;s Prices</span>
                    </Typography>

                    {/* Subheadline */}
                    <Typography
                        variant="bodyLarge"
                        align="center"
                        className="text-[#E5E5CB]/60 max-w-3xl mx-auto leading-relaxed text-sm xs:text-base sm:text-lg lg:text-xl px-4 mt-2"
                    >
                        The first decentralized gas futures marketplace. Lock in today&apos;s gas prices for future transactions across Ethereum, Base, Arbitrum, and beyond.
                    </Typography>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 xs:gap-4 py-6 lg:py-10">
                        <Link
                            href="/dashboard/buy"
                            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 xs:gap-3 px-6 py-3 xs:px-8 xs:py-4 bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] text-[#1A120B] font-bold rounded-xl xs:rounded-2xl hover:from-[#E5E5CB] hover:to-[#D5CEA3] transition-all shadow-[0_0_20px_rgba(213,206,163,0.3)] hover:shadow-[0_0_30px_rgba(213,206,163,0.5)] transform hover:-translate-y-1 text-sm xs:text-base"
                        >
                            Start Saving Now
                            <HiArrowRight className="w-4 h-4 xs:w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 xs:px-8 xs:py-4 bg-[#3C2A21]/50 text-[#E5E5CB] font-semibold rounded-xl xs:rounded-2xl border border-[#D5CEA3]/20 hover:bg-[#3C2A21] hover:border-[#D5CEA3]/40 transition-all backdrop-blur-sm text-sm xs:text-base"
                        >
                            How It Works
                        </a>
                    </div>

                    {/* Partner Badges */}
                    <div className="border-t border-[#3C2A21] pt-6 lg:pt-8 w-full">
                        <p className="text-[#D5CEA3]/40 text-[8px] xs:text-[10px] sm:text-xs font-bold tracking-[0.2em] xs:tracking-[0.3em] uppercase mb-4 lg:mb-6">Powering Infrastructure With</p>
                        <div className="flex flex-wrap justify-center items-center gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16 opacity-50 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0">
                            <div className="flex items-center gap-2 xs:gap-3 text-[#E5E5CB] font-bold text-base xs:text-lg group">
                                <HiSquare3Stack3D className="text-[#D5CEA3] w-4 h-4 xs:w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="tracking-tight">Uniswap v4</span>
                            </div>
                            <div className="flex items-center gap-2 xs:gap-3 text-[#E5E5CB] font-bold text-base xs:text-lg group">
                                <HiGlobeEuropeAfrica className="text-[#D5CEA3] w-4 h-4 xs:w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="tracking-tight">Li.Fi</span>
                            </div>
                            <div className="flex items-center gap-2 xs:gap-3 text-[#E5E5CB] font-bold text-base xs:text-lg group">
                                <HiCircleStack className="text-[#D5CEA3] w-4 h-4 xs:w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="tracking-tight">Sui Oracle</span>
                            </div>
                            <div className="flex items-center gap-2 xs:gap-3 text-[#E5E5CB] font-bold text-base xs:text-lg group opacity-40">
                                <div className="flex items-center gap-1.5 xs:gap-2">
                                    <HiIdentification className="text-[#D5CEA3] w-4 h-4 xs:w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="tracking-tight">ENS</span>
                                </div>
                                <span className="text-[7px] xs:text-[8px] px-1 py-0.5 xs:px-1.5 xs:py-0.5 rounded bg-[#D5CEA3]/10 border border-[#D5CEA3]/20 text-[#D5CEA3] uppercase tracking-tighter">Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

