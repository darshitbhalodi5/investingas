"use client";

import { Typography } from "@/components/ui/Typography";
import { HiCpuChip, HiCodeBracket } from "react-icons/hi2";

export function DevelopersSection() {
    return (
        <section className="container mx-auto px-6 py-8 lg:py-12">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                <div className="flex flex-col items-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#3C2A21]/50 border border-[#D5CEA3]/20 mb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D5CEA3]">Next-Gen Infrastructure</span>
                    </div>
                    <Typography variant="h2" align="center" className="mb-6">
                        Enterprise Use Cases
                    </Typography>
                    <div className="space-y-6">
                        <div className="flex gap-4 group">
                            <div className="mt-1 w-10 h-10 rounded-xl bg-[#3C2A21] flex items-center justify-center text-[#D5CEA3] shrink-0 border border-[#D5CEA3]/10 group-hover:border-[#D5CEA3]/30 transition-all">
                                <HiCpuChip className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-[#E5E5CB] mb-1">DAO Treasuries</h4>
                                <p className="text-[#E5E5CB]/60 text-sm leading-relaxed text-justify">
                                    Hedge against Q4 gas spikes. Budget your protocol governance costs in fixed-price USDC positions to ensure predictable operations.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 group">
                            <div className="mt-1 w-10 h-10 rounded-xl bg-[#3C2A21] flex items-center justify-center text-[#D5CEA3] shrink-0 border border-[#D5CEA3]/10 group-hover:border-[#D5CEA3]/30 transition-all">
                                <HiCodeBracket className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-[#E5E5CB] mb-1">Keeper Bots & Arbitrage</h4>
                                <p className="text-[#E5E5CB]/60 text-sm leading-relaxed text-justify">
                                    Ensure your bots always run profitably. Never miss an arbitrage opportunity because of a temporary network fee spike.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Decorative Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#D5CEA3]/20 to-transparent blur-lg rounded-2xl" />

                    <div className="relative bg-[#1A120B] border border-[#D5CEA3]/20 rounded-2xl p-6 font-mono text-xs md:text-sm overflow-hidden shadow-2xl">
                        <div className="flex items-center gap-2 mb-6 text-[#E5E5CB]/40 border-b border-[#3C2A21] pb-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/30"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400/30"></div>
                                <div className="w-3 h-3 rounded-full bg-[#D5CEA3]/30"></div>
                            </div>
                            <span className="ml-auto text-[10px] tracking-widest uppercase opacity-50 font-bold">interaction.ts</span>
                        </div>

                        <div className="space-y-2.5">
                            <p className="flex gap-2">
                                <span className="text-[#3C2A21] italic opacity-60">// Interface with the v4 Hook</span>
                            </p>
                            <p className="flex gap-2">
                                <span className="text-[#D5CEA3]">const</span>
                                <span className="text-[#E5E5CB]">tx</span>
                                <span className="text-[#D5CEA3]">=</span>
                                <span className="text-[#D5CEA3]">await</span>
                                <span className="text-[#E5E5CB]">gasHook</span>.<span className="text-[#D5CEA3]">lockPrice</span>(&#123;
                            </p>
                            <p className="pl-6">
                                <span className="text-[#E5E5CB]/50">targetChain:</span>
                                <span className="text-[#D5CEA3]">CHAINS.BASE</span>,
                            </p>
                            <p className="pl-6">
                                <span className="text-[#E5E5CB]/50">maxGwei:</span>
                                <span className="text-[#E5E5CB] font-bold">25</span>,
                            </p>
                            <p className="pl-6">
                                <span className="text-[#E5E5CB]/50">recipient:</span>
                                <span className="text-[#D5CEA3]">&quot;0x71C...&quot;</span>,
                            </p>
                            <p className="pl-6">
                                <span className="text-[#E5E5CB]/50">value:</span>
                                <span className="text-[#D5CEA3]">parseEther</span>(<span className="text-[#D5CEA3]">&quot;0.1&quot;</span>)
                            </p>
                            <p>&#125;);</p>

                            <div className="h-4" />
                            <p className="text-[#3C2A21] italic opacity-60 font-medium">
                                // Real-time settlement across 70+ chains
                            </p>
                            <p className="flex gap-2">
                                <span className="text-[#D5CEA3]">await</span>
                                <span className="text-[#E5E5CB]">tx</span>.<span className="text-[#D5CEA3]">wait</span>();
                            </p>
                        </div>

                        {/* Visual accent */}
                        <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-[#D5CEA3]/5 blur-2xl rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
