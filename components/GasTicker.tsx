"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useAllGasPrices } from "@/hooks/useGasPrices";

const CHAIN_COLORS: Record<string, string> = {
    sepolia: "#627eea",
    base: "#0052ff",
    arbitrum: "#28a0f0",
    polygon: "#8247e5",
    optimism: "#ff0420",
};

export function GasTicker() {
    const { prices, isLoading } = useAllGasPrices();

    if (isLoading && (!prices || prices.length === 0)) {
        return (
            <div className="py-3 border-y border-white/5 bg-black/30 backdrop-blur-sm h-[45px] animate-pulse" />
        );
    }

    return (
        <div className="overflow-hidden py-3 border-y border-white/5 bg-black/30 backdrop-blur-sm">
            <div className="flex animate-scroll gap-12 px-4">
                {[...prices, ...prices, ...prices].map((gas, idx) => (
                    <div key={idx} className="flex items-center gap-3 shrink-0">
                        <div
                            className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            style={{ backgroundColor: CHAIN_COLORS[gas.chain] || "#ffffff" }}
                        />
                        <span className="text-sm font-medium text-white/70">{gas.chainName}</span>
                        <span className="text-sm font-bold">{(gas.priceGwei || 0).toFixed(2)} gwei</span>
                        <span
                            className={`flex items-center gap-1 text-xs ${gas.change24h > 0 ? "text-red-400" :
                                gas.change24h < 0 ? "text-green-400" :
                                    "text-white/50"
                                }`}
                        >
                            {gas.change24h > 0 ? <TrendingUp className="w-3 h-3" /> :
                                gas.change24h < 0 ? <TrendingDown className="w-3 h-3" /> :
                                    <Minus className="w-3 h-3" />}
                            {Math.abs(gas.change24h).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
            <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
        </div>
    );
}
