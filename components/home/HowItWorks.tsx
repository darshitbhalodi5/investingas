"use client";

import { Typography } from "@/components/ui/Typography";

const STEPS = [
    {
        number: "1",
        title: "Buy Gas Credits",
        description: "Deposit USDC on Sepolia when gas prices are low. Our Uniswap v4 hook locks in that price for your future use.",
    },
    {
        number: "2",
        title: "Wait for Spike",
        description: "Our high-performance Sui-powered oracle monitors gas fluctuations across multiple chains in real-time.",
    },
    {
        number: "3",
        title: "Redeem Anywhere",
        description: "Redeem your gas credits instantly as native gas on any supported chain via our seamless LiFi integration.",
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="container mx-auto px-6 py-8 lg:py-12 relative overflow-hidden">
            <div className="text-center mb-20 relative z-10">
                <Typography variant="h2" align="center" className="mb-4">
                    How It <span className="bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] bg-clip-text text-transparent">Works</span>
                </Typography>
                <Typography variant="bodyLarge" align="center" className="text-[#E5E5CB]/60 max-w-xl mx-auto">
                    A simple three-step process to secure your future gas costs.
                </Typography>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative z-10">
                {STEPS.map((step, index) => (
                    <div key={index} className="text-center group">
                        <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-[#E5E5CB] to-[#D5CEA3] text-[#1A120B] shadow-2xl shadow-[#D5CEA3]/10 group-hover:scale-110 transition-transform duration-500 relative`}>
                            {step.number}
                            {/* Inner Ring */}
                            <div className="absolute inset-2 border border-black/10 rounded-[1.5rem]" />
                        </div>

                        <Typography variant="h4" align="center" className="mb-4 group-hover:text-[#D5CEA3] transition-colors">
                            {step.title}
                        </Typography>

                        <p className="text-[#E5E5CB]/60 text-sm leading-relaxed px-4 text-justify">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
