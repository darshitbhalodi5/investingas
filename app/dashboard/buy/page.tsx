"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Fuel, AlertCircle, CheckCircle, ArrowRight, Info } from "lucide-react";

const SUPPORTED_CHAINS = [
    { id: "ethereum", name: "Ethereum", price: 12, color: "#627eea" },
    { id: "base", name: "Base", price: 0.5, color: "#0052ff" },
    { id: "arbitrum", name: "Arbitrum", price: 0.1, color: "#28a0f0" },
    { id: "polygon", name: "Polygon", price: 45, color: "#8247e5" },
    { id: "optimism", name: "Optimism", price: 0.3, color: "#ff0420" },
];

export default function BuyCreditsPage() {
    const { isConnected } = useAccount();
    const [selectedChain, setSelectedChain] = useState("ethereum");
    const [amount, setAmount] = useState("");
    const [expiry, setExpiry] = useState(30);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const selectedChainData = SUPPORTED_CHAINS.find(c => c.id === selectedChain);
    const usdcAmount = parseFloat(amount) || 0;
    const fee = usdcAmount * 0.005; // 0.5% fee
    const netAmount = usdcAmount - fee;
    const gasUnits = selectedChainData ? (netAmount / (selectedChainData.price * 0.000000001 * 3000)) : 0; // Simplified calc

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || usdcAmount < 10) return;

        setIsSubmitting(true);
        // Simulate transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setSuccess(true);
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                    <Fuel className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Connect to Buy Credits</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Connect your wallet to purchase gas credits at today&apos;s prices.
                </p>
                <ConnectButton />
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-green-500/20">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Credits Purchased!</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Your gas credits have been locked in at {selectedChainData?.price} gwei for {expiry} days.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.1] transition-all font-semibold">
                        Buy More
                    </button>
                    <a href="/dashboard" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-semibold flex items-center gap-2">
                        View Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Buy Gas Credits</h1>
                <p className="text-white/60">
                    Lock in today&apos;s gas prices for future transactions
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Chain Selection */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <label className="block text-sm font-medium text-white/60 mb-4">
                        Select Chain
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {SUPPORTED_CHAINS.map((chain) => (
                            <button
                                key={chain.id}
                                type="button"
                                onClick={() => setSelectedChain(chain.id)}
                                className={`p-4 rounded-xl border transition-all text-left ${selectedChain === chain.id
                                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                                        : "border-white/10 bg-white/[0.02] hover:border-white/20 text-white/70"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                        style={{ backgroundColor: chain.color }}
                                    />
                                    <span className="font-medium">{chain.name}</span>
                                </div>
                                <p className="text-sm text-white/40">{chain.price} gwei</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Input */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <label className="block text-sm font-medium text-white/60 mb-4">
                        Amount (USDC)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="10"
                            max="10000"
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-white/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">
                            USDC
                        </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                        {[100, 250, 500, 1000].map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => setAmount(preset.toString())}
                                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium"
                            >
                                ${preset}
                            </button>
                        ))}
                    </div>
                    {usdcAmount > 0 && usdcAmount < 10 && (
                        <p className="mt-3 text-sm text-amber-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Minimum purchase is $10
                        </p>
                    )}
                </div>

                {/* Expiry Selection */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <label className="block text-sm font-medium text-white/60 mb-4">
                        Lock Duration
                    </label>
                    <div className="flex gap-3 flex-wrap">
                        {[7, 14, 30, 60, 90].map((days) => (
                            <button
                                key={days}
                                type="button"
                                onClick={() => setExpiry(days)}
                                className={`px-6 py-3 rounded-xl border transition-all font-medium ${expiry === days
                                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                                        : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                                    }`}
                            >
                                {days} days
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                {usdcAmount >= 10 && (
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                        <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Chain</span>
                                <span className="font-medium">{selectedChainData?.name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Locked Price</span>
                                <span className="font-medium text-green-400">{selectedChainData?.price} gwei</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Amount</span>
                                <span className="font-medium">${usdcAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Protocol Fee (0.5%)</span>
                                <span className="font-medium">-${fee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Net Amount</span>
                                <span className="font-medium">${netAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Expiry</span>
                                <span className="font-medium">{expiry} days</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-white/60">Estimated Gas Units</span>
                                <span className="font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">~{(gasUnits / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-white/70">
                                Your credits will be locked at {selectedChainData?.price} gwei for {expiry} days.
                                You can redeem them anytime when gas prices are higher to save money.
                            </p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={usdcAmount < 10 || isSubmitting}
                    className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        <>
                            Buy Gas Credits
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
