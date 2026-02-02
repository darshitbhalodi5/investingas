"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Fuel, Clock, ArrowRight, Send, AlertTriangle } from "lucide-react";

// Mock credits data
const MOCK_CREDITS = [
    { id: 0, chain: "Ethereum", locked: 8, current: 24, gasUnits: 500000, expiry: 12, isActive: true },
    { id: 1, chain: "Base", locked: 0.3, current: 0.5, gasUnits: 2000000, expiry: 25, isActive: true },
    { id: 2, chain: "Polygon", locked: 30, current: 55, gasUnits: 800000, expiry: 8, isActive: true },
    { id: 3, chain: "Arbitrum", locked: 0.05, current: 0.08, gasUnits: 1500000, expiry: 45, isActive: true },
];

export default function CreditsPage() {
    const { isConnected } = useAccount();
    const [selectedCredit, setSelectedCredit] = useState<number | null>(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferAddress, setTransferAddress] = useState("");

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                    <Fuel className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Connect to View Credits</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Connect your wallet to view and manage your gas credits.
                </p>
                <ConnectButton />
            </div>
        );
    }

    const formatGasUnits = (units: number) => {
        if (units >= 1000000) return `${(units / 1000000).toFixed(1)}M`;
        if (units >= 1000) return `${(units / 1000).toFixed(0)}K`;
        return units.toString();
    };

    const chainColors = {
        "Ethereum": "bg-[#627eea]",
        "Base": "bg-[#0052ff]",
        "Polygon": "bg-[#8247e5]",
        "Arbitrum": "bg-[#28a0f0]"
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Gas Credits</h1>
                    <p className="text-white/60">
                        Manage, redeem, and transfer your gas credits
                    </p>
                </div>
                <a href="/dashboard/buy" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25">
                    <Fuel className="w-5 h-5" />
                    Buy More Credits
                </a>
            </div>

            {/* Credits Grid */}
            <div className="grid gap-4">
                {MOCK_CREDITS.map((credit) => {
                    const isBeneficial = credit.current > credit.locked;
                    const savingsPercent = isBeneficial
                        ? ((credit.current - credit.locked) / credit.current * 100).toFixed(0)
                        : "0";
                    const isExpiringSoon = credit.expiry <= 7;

                    return (
                        <div
                            key={credit.id}
                            className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl hover:bg-white/[0.05] transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                {/* Chain Info */}
                                <div className="flex items-center gap-4 lg:w-48">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${chainColors[credit.chain as keyof typeof chainColors] || 'bg-gray-600'}`}>
                                        {credit.chain.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">{credit.chain}</p>
                                        <p className="text-sm text-white/40">{formatGasUnits(credit.gasUnits)} gas units</p>
                                    </div>
                                </div>

                                {/* Price Info */}
                                <div className="flex flex-wrap gap-8 flex-1">
                                    <div>
                                        <p className="text-sm text-white/40 mb-1">Locked Price</p>
                                        <p className="font-semibold text-lg text-green-400">{credit.locked} gwei</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 mb-1">Current Price</p>
                                        <p className={`font-semibold text-lg ${isBeneficial ? "text-red-400" : "text-white/60"}`}>
                                            {credit.current} gwei
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 mb-1">Potential Savings</p>
                                        <p className={`font-semibold text-lg ${isBeneficial ? "bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" : "text-white/40"}`}>
                                            {isBeneficial ? `${savingsPercent}%` : "No savings"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 mb-1">Expires In</p>
                                        <p className={`font-semibold text-lg flex items-center gap-2 ${isExpiringSoon ? "text-amber-500" : ""}`}>
                                            {isExpiringSoon && <AlertTriangle className="w-4 h-4" />}
                                            {credit.expiry} days
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedCredit(credit.id);
                                            setShowTransferModal(true);
                                        }}
                                        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Transfer
                                    </button>
                                    <button
                                        disabled={!isBeneficial}
                                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${isBeneficial
                                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                                                : "bg-white/5 text-white/40 border border-white/5 cursor-not-allowed"
                                            }`}
                                    >
                                        Redeem
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {MOCK_CREDITS.length === 0 && (
                <div className="text-center py-16 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl">
                    <Clock className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Credits Yet</h3>
                    <p className="text-white/60 mb-6">
                        You haven&apos;t purchased any gas credits yet.
                    </p>
                    <a href="/dashboard/buy" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-semibold inline-flex">
                        Buy Your First Credits
                    </a>
                </div>
            )}

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowTransferModal(false)}
                    />
                    <div className="bg-[#12121a] border border-white/10 p-6 rounded-2xl max-w-md w-full relative z-10 shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4">Transfer Credits</h3>
                        <p className="text-white/60 mb-6">
                            Enter the recipient&apos;s wallet address to transfer your gas credits.
                        </p>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={transferAddress}
                            onChange={(e) => setTransferAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl mb-4 focus:border-indigo-500 outline-none transition-colors"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowTransferModal(false)}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={!transferAddress.startsWith("0x")}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-medium"
                            >
                                Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
