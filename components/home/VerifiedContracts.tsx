"use client";

import { Typography } from "@/components/ui/Typography";

const CONTRACTS = [
    {
        name: "InvestInGasHook",
        address: "0xaD5...80C0",
        network: "Sepolia",
        explorerUrl: "https://sepolia.etherscan.io/address/0xaD599566C6cA5b222d782d152d21cF77efdc80C0"
    },
    {
        name: "GasOracle",
        address: "0x5fe...cb8c",
        network: "Sui Testnet",
        explorerUrl: "https://suiscan.xyz/testnet/object/0x5fef78aab89f46b876bd9ab349887995994108443949269c2c867478fa53cb8c"
    },
    {
        name: "LiFiBridger",
        address: "0xf5e...72cb",
        network: "Sepolia",
        explorerUrl: "https://sepolia.etherscan.io/address/0xf5e667d4a18a149145853d30e72b010b376272cb"
    }
];

export function VerifiedContracts() {
    return (
        <section className="container mx-auto px-6 py-8 lg:py-12 border-t border-[#3C2A21]">
            <div className="text-center">
                <Typography
                    variant="caption"
                    className="text-[#D5CEA3]/50 uppercase tracking-widest text-center text-xs font-semibold mb-6 block"
                >
                    System Contracts
                </Typography>

                <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6">
                    {CONTRACTS.map((contract, index) => (
                        <a
                            key={index}
                            href={contract.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto group flex items-center justify-between sm:justify-start gap-3 border border-[#3C2A21] px-4 py-3 sm:px-3 sm:py-1.5 rounded-xl bg-[#1A120B]/50 hover:bg-[#3C2A21]/30 hover:border-[#D5CEA3]/30 transition-all duration-300"
                            title={contract.network}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className="text-[10px] xs:text-xs font-mono text-[#E5E5CB]/40 group-hover:text-[#E5E5CB]/80 transition-colors shrink-0">
                                    {contract.name}:
                                </span>
                                <span className="text-[10px] xs:text-xs font-mono text-[#E5E5CB]/60 group-hover:text-[#D5CEA3] transition-colors truncate">
                                    {contract.address}
                                </span>
                            </div>
                            <div className="sm:hidden text-[10px] px-2 py-0.5 rounded-full bg-[#3C2A21]/50 text-[#D5CEA3]/50">
                                {contract.network.split(' ')[0]}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
