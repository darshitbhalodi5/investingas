"use client";

import { Typography } from "@/components/ui/Typography";
import { HiArrowTrendingDown, HiWallet } from "react-icons/hi2";

export function SavingsPreview() {
    return (
        <section className="container mx-auto px-6 py-8 lg:py-12">
            <div className="bg-[#3C2A21]/30 backdrop-blur-xl border border-[#D5CEA3]/10 shadow-2xl rounded-3xl p-8 md:p-14 max-w-5xl mx-auto overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D5CEA3]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <Typography variant="h2" className="mb-4">
                            See Your Potential <span className="bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] bg-clip-text text-transparent">Savings</span>
                        </Typography>
                        <Typography variant="body" className="text-[#E5E5CB]/60 mb-10 leading-relaxed text-justify">
                            Gas prices fluctuate wildly. Lock in low prices now and use them when prices spike. Our protocol handles the complexity of cross-chain settlement automatically.
                        </Typography>

                        {/* Example Calculation */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-4 border-b border-[#D5CEA3]/10 hover:bg-[#3C2A21]/20 px-2 transition-colors rounded-lg">
                                <span className="text-[#E5E5CB]/60 text-sm">You lock in at</span>
                                <span className="font-bold text-[#D5CEA3] text-lg">5 gwei</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-[#D5CEA3]/10 hover:bg-[#3C2A21]/20 px-2 transition-colors rounded-lg">
                                <span className="text-[#E5E5CB]/60 text-sm">Gas spikes to</span>
                                <span className="font-bold text-red-400 text-lg">50 gwei</span>
                            </div>
                            <div className="flex justify-between items-center py-5 px-2 bg-[#D5CEA3]/5 rounded-xl mt-4">
                                <span className="text-[#E5E5CB]/60">Your total savings</span>
                                <span className="font-bold text-2xl bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] bg-clip-text text-transparent">$18.50 per tx</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex justify-center py-8">
                        {/* Visual representation card */}
                        <div className="aspect-square w-64 xs:w-72 rounded-[2.5rem] bg-gradient-to-br from-[#3C2A21] to-[#1A120B] border border-[#D5CEA3]/20 flex items-center justify-center backdrop-blur-sm relative shadow-2xl group transition-all duration-500 hover:border-[#D5CEA3]/40">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-[#D5CEA3]/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="text-center relative z-10">
                                <div className="text-7xl font-bold bg-gradient-to-b from-[#E5E5CB] to-[#D5CEA3] bg-clip-text text-transparent mb-2">90%</div>
                                <div className="text-[#D5CEA3]/60 text-[10px] tracking-[0.2em] uppercase font-bold">Maximum Efficiency</div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-6 -right-6 scale-90 xs:scale-100 bg-[#3C2A21] border border-[#D5CEA3]/20 backdrop-blur-md p-5 rounded-2xl shadow-2xl animate-[bounce_3s_infinite] hover:bg-[#D5CEA3] hover:text-[#1A120B] transition-colors duration-300">
                                <HiArrowTrendingDown className="w-8 h-8 text-inherit" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 scale-90 xs:scale-100 bg-[#3C2A21] border border-[#D5CEA3]/20 backdrop-blur-md p-5 rounded-2xl shadow-2xl animate-[bounce_4s_infinite] hover:bg-[#D5CEA3] hover:text-[#1A120B] transition-colors duration-300">
                                <HiWallet className="w-8 h-8 text-inherit" />
                            </div>

                            {/* Decorative particles (simplified dots) */}
                            <div className="absolute top-10 left-10 w-1 h-1 bg-[#D5CEA3]/30 rounded-full animate-pulse" />
                            <div className="absolute bottom-12 right-8 w-1.5 h-1.5 bg-[#D5CEA3]/20 rounded-full animate-pulse delay-700" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
