"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Fuel, Clock, ArrowRight, Send, AlertTriangle, Loader2, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { useUserCredits, useRedeemCredits, useTransferCredits, useCalculateSavings, GasCredit } from "@/hooks/useGasFutures";
import { useAllGasPrices } from "@/hooks/useGasPrices";
import { CROSS_CHAIN_OPTIONS, getMockLifiQuote, formatLifiEstimate } from "@/lib/lifi";

// Chain colors mapping
const chainColors: Record<string, string> = {
    "ethereum": "bg-[#627eea]",
    "base": "bg-[#0052ff]",
    "polygon": "bg-[#8247e5]",
    "arbitrum": "bg-[#28a0f0]",
    "optimism": "bg-[#ff0420]",
};

export default function CreditsPage() {
    const { isConnected } = useAccount();
    const [selectedCredit, setSelectedCredit] = useState<GasCredit | null>(null);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferAddress, setTransferAddress] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [redeemType, setRedeemType] = useState<"cash" | "crosschain">("cash");
    const [selectedDestChain, setSelectedDestChain] = useState(1);
    const [redeemAmount, setRedeemAmount] = useState("");

    // Contract hooks
    const { credits, isLoading: creditsLoading, refetch: refetchCredits } = useUserCredits();
    const { prices } = useAllGasPrices();
    const { redeemCredits, isLoading: isRedeeming, isSuccess: redeemSuccess } = useRedeemCredits();
    const { transferCredits, isLoading: isTransferring, isSuccess: transferSuccess } = useTransferCredits();

    // Reset modals on success
    useEffect(() => {
        if (redeemSuccess) {
            setShowRedeemModal(false);
            setSelectedCredit(null);
            refetchCredits();
        }
    }, [redeemSuccess, refetchCredits]);

    useEffect(() => {
        if (transferSuccess) {
            setShowTransferModal(false);
            setSelectedCredit(null);
            setTransferAddress("");
            setTransferAmount("");
            refetchCredits();
        }
    }, [transferSuccess, refetchCredits]);

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

    const formatGasUnits = (units: string) => {
        const num = parseFloat(units);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return units;
    };

    const getChainCurrentPrice = (chainId: string) => {
        const price = prices.find(p => p.chain === chainId);
        return price?.priceGwei || 0;
    };

    const handleRedeem = () => {
        if (!selectedCredit || !redeemAmount) return;

        if (redeemType === "cash") {
            redeemCredits(selectedCredit.id, redeemAmount);
        } else {
            // For cross-chain, we would get LiFi quote and use redeemCreditsWithLifi
            // For now, just do cash settlement
            redeemCredits(selectedCredit.id, redeemAmount);
        }
    };

    const handleTransfer = () => {
        if (!selectedCredit || !transferAddress || !transferAmount) return;
        transferCredits(selectedCredit.id, transferAddress, transferAmount);
    };

    // Get mock LiFi estimate for display
    const lifiEstimate = selectedCredit && redeemType === "crosschain"
        ? formatLifiEstimate(getMockLifiQuote(42069, selectedDestChain, "100"))
        : null;

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
                <Link href="/dashboard/buy" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25">
                    <Fuel className="w-5 h-5" />
                    Buy More Credits
                </Link>
            </div>

            {/* Credits Grid */}
            {creditsLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                </div>
            ) : credits.length === 0 ? (
                <div className="text-center py-16 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-2xl">
                    <Clock className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Credits Yet</h3>
                    <p className="text-white/60 mb-6">
                        You haven&apos;t purchased any gas credits yet.
                    </p>
                    <Link href="/dashboard/buy" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-semibold inline-flex">
                        Buy Your First Credits
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {credits.map((credit) => {
                        const currentPrice = getChainCurrentPrice(credit.targetChain);
                        const isBeneficial = currentPrice > credit.lockedPriceGwei;
                        const savingsPercent = isBeneficial && currentPrice > 0
                            ? Math.round(((currentPrice - credit.lockedPriceGwei) / currentPrice) * 100)
                            : 0;
                        const isExpiringSoon = credit.daysUntilExpiry <= 7;

                        return (
                            <div
                                key={credit.id}
                                className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl hover:bg-white/[0.05] transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Chain Info */}
                                    <div className="flex items-center gap-4 lg:w-48">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${chainColors[credit.targetChain] || 'bg-gray-600'}`}>
                                            {credit.targetChain.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg capitalize">{credit.targetChain}</p>
                                            <p className="text-sm text-white/40">{formatGasUnits(credit.remainingGasUnits)} gas units</p>
                                        </div>
                                    </div>

                                    {/* Price Info */}
                                    <div className="flex flex-wrap gap-8 flex-1">
                                        <div>
                                            <p className="text-sm text-white/40 mb-1">Locked Price</p>
                                            <p className="font-semibold text-lg text-green-400">{credit.lockedPriceGwei} gwei</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-white/40 mb-1">Current Price</p>
                                            <p className={`font-semibold text-lg ${isBeneficial ? "text-red-400" : "text-white/60"}`}>
                                                {currentPrice} gwei
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
                                                {credit.daysUntilExpiry} days
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedCredit(credit);
                                                setTransferAmount(credit.remainingGasUnits);
                                                setShowTransferModal(true);
                                            }}
                                            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Transfer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCredit(credit);
                                                setRedeemAmount(credit.remainingGasUnits);
                                                setShowRedeemModal(true);
                                            }}
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
            )}

            {/* Redeem Modal */}
            {showRedeemModal && selectedCredit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowRedeemModal(false)}
                    />
                    <div className="bg-[#12121a] border border-white/10 p-6 rounded-2xl max-w-md w-full relative z-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Redeem Credits</h3>
                            <button onClick={() => setShowRedeemModal(false)} className="text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-white/60 mb-6">
                            Choose how to receive your savings from {selectedCredit.targetChain} credits.
                        </p>

                        {/* Redeem Type Selection */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setRedeemType("cash")}
                                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${redeemType === "cash"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                    }`}
                            >
                                Cash (USDC)
                            </button>
                            <button
                                onClick={() => setRedeemType("crosschain")}
                                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${redeemType === "crosschain"
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white/5 text-white/60 hover:bg-white/10"
                                    }`}
                            >
                                Cross-Chain Gas
                            </button>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="text-sm text-white/60 mb-2 block">Gas Units to Redeem</label>
                            <input
                                type="text"
                                value={redeemAmount}
                                onChange={(e) => setRedeemAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-white/40 mt-1">
                                Available: {formatGasUnits(selectedCredit.remainingGasUnits)}
                            </p>
                        </div>

                        {/* Cross-chain destination */}
                        {redeemType === "crosschain" && (
                            <div className="mb-4">
                                <label className="text-sm text-white/60 mb-2 block">Destination Chain</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CROSS_CHAIN_OPTIONS.map((chain) => (
                                        <button
                                            key={chain.chainId}
                                            onClick={() => setSelectedDestChain(chain.chainId)}
                                            className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedDestChain === chain.chainId
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                                }`}
                                        >
                                            {chain.icon} {chain.name}
                                        </button>
                                    ))}
                                </div>
                                {lifiEstimate && (
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg text-sm">
                                        <p className="text-white/60">Estimated received:</p>
                                        <p className="font-semibold text-green-400">
                                            ~{lifiEstimate.receivedAmount} {lifiEstimate.symbol}
                                        </p>
                                        <p className="text-white/40 text-xs mt-1">
                                            Duration: {lifiEstimate.duration} • Fee: ${lifiEstimate.fees}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRedeem}
                                disabled={isRedeeming || !redeemAmount}
                                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                            >
                                {isRedeeming ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Redeeming...
                                    </>
                                ) : (
                                    <>
                                        Redeem
                                        <CheckCircle className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {showTransferModal && selectedCredit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowTransferModal(false)}
                    />
                    <div className="bg-[#12121a] border border-white/10 p-6 rounded-2xl max-w-md w-full relative z-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Transfer Credits</h3>
                            <button onClick={() => setShowTransferModal(false)} className="text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-white/60 mb-6">
                            Transfer your {selectedCredit.targetChain} gas credits to another wallet.
                        </p>

                        <div className="mb-4">
                            <label className="text-sm text-white/60 mb-2 block">Recipient Address</label>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={transferAddress}
                                onChange={(e) => setTransferAddress(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-white/60 mb-2 block">Gas Units to Transfer</label>
                            <input
                                type="text"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none transition-colors"
                            />
                            <p className="text-xs text-white/40 mt-1">
                                Available: {formatGasUnits(selectedCredit.remainingGasUnits)}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowTransferModal(false)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransfer}
                                disabled={isTransferring || !transferAddress.startsWith("0x") || !transferAmount}
                                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                            >
                                {isTransferring ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Transferring...
                                    </>
                                ) : (
                                    <>
                                        Transfer
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
