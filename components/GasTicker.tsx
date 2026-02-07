"use client";

import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface GasPrice {
    chain: string;
    price: number;
    change24h: number;
    color: string;
}

const MOCK_GAS_PRICES: GasPrice[] = [
    { chain: "Sepolia", price: 2, change24h: -15, color: "#627eea" },
    { chain: "Base Sepolia", price: 0.1, change24h: 5, color: "#0052ff" },
    { chain: "Arbitrum Sepolia", price: 0.1, change24h: -8, color: "#28a0f0" },
    { chain: "Optimism Sepolia", price: 0.1, change24h: 0, color: "#ff0420" },
    { chain: "Polygon Amoy", price: 15, change24h: 22, color: "#8247e5" },
];

export function GasTicker() {
    const [prices, setPrices] = useState<GasPrice[]>(MOCK_GAS_PRICES);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev =>
                prev.map(p => ({
                    ...p,
                    price: Math.max(0.01, p.price + (Math.random() - 0.5) * (p.price * 0.05)),
                    change24h: p.change24h + (Math.random() - 0.5) * 2,
                }))
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="overflow-hidden py-3 border-y border-white/5 bg-black/30 backdrop-blur-sm">
            <div className="flex animate-scroll gap-12 px-4">
                {[...prices, ...prices, ...prices].map((gas, idx) => (
                    <div key={idx} className="flex items-center gap-3 shrink-0">
                        <div
                            className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            style={{ backgroundColor: gas.color }}
                        />
                        <span className="text-sm font-medium text-white/70">{gas.chain}</span>
                        <span className="text-sm font-bold">{gas.price.toFixed(2)} gwei</span>
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
