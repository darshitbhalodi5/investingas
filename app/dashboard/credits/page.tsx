"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Fuel, Clock, ArrowRight, AlertTriangle, Loader2, CheckCircle, X, Wallet, Zap, Coins } from "lucide-react";
import Link from "next/link";
import { useUserCredits, useRedeemCredits, useCalculateSavings, GasCredit } from "@/hooks/useGasFutures";
import { useAllGasPrices } from "@/hooks/useGasPrices";
import { CROSS_CHAIN_OPTIONS, getMockLifiQuote, formatLifiEstimate } from "@/lib/lifi";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { RiGasStationLine } from "react-icons/ri";

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
    const [redeemType, setRedeemType] = useState<"cash" | "crosschain">("cash");
    const [selectedDestChain, setSelectedDestChain] = useState(1);
    const [redeemAmount, setRedeemAmount] = useState("");

    // Contract hooks
    const { credits, isLoading: creditsLoading, refetch: refetchCredits } = useUserCredits();
    const { prices } = useAllGasPrices();
    const { redeemCredits, isLoading: isRedeeming, isSuccess: redeemSuccess } = useRedeemCredits();

    // Reset modals on success
    useEffect(() => {
        if (redeemSuccess) {
            setShowRedeemModal(false);
            setSelectedCredit(null);
            refetchCredits();
        }
    }, [redeemSuccess, refetchCredits]);

    if (!isConnected) {
        return (
            <ConnectWalletPrompt
                title="Connect to View Credits"
                description="Connect your wallet to view and manage your gas credits."
                icon={RiGasStationLine}
            />
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

    // Get mock LiFi estimate for display
    const lifiEstimate = selectedCredit && redeemType === "crosschain"
        ? formatLifiEstimate(getMockLifiQuote(42069, selectedDestChain, "100"))
        : null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                        My Gas Portfolio
                    </h1>
                    <p className="text-lg font-medium text-white/40">
                        Active positions and gas savings across 5 networks
                    </p>
                </div>
                <Link href="/dashboard/buy" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Fuel className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 uppercase tracking-widest text-xs">Accumulate Gas</span>
                </Link>
            </div>

            {/* Credits Grid */}
            {creditsLoading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <Loader2 className="w-8 h-8 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
            ) : credits.length === 0 ? (
                <div className="text-center py-24 bg-[#1a1b23]/40 border border-white/5 backdrop-blur-xl rounded-[3rem] relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <Clock className="w-12 h-12 text-white/20" />
                        </div>
                        <h3 className="text-3xl font-black mb-4">No Active Positions</h3>
                        <p className="text-lg text-white/40 mb-10 max-w-sm mx-auto font-medium">
                            Your gas portfolio is currently empty. Start hedging against gas spikes today.
                        </p>
                        <Link href="/dashboard/buy" className="px-10 py-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[2rem] transition-all font-black inline-flex items-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 uppercase tracking-widest text-xs">
                            Secure First Position
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
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
                                className="group relative bg-[#1a1b23]/40 border border-white/5 backdrop-blur-xl p-6 rounded-[2rem] hover:bg-[#1a1b23]/60 transition-all duration-300 overflow-hidden"
                            >
                                {/* Subtle indicator line for the chain */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1 ${chainColors[credit.targetChain] || 'bg-gray-600'} opacity-50`} />

                                <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                                    {/* Chain & Overview */}
                                    <div className="flex items-center gap-5 lg:w-64">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${chainColors[credit.targetChain] || 'bg-gray-600'} ring-4 ring-white/5`}>
                                            {credit.targetChain.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-xl capitalize tracking-tight">{credit.targetChain}</p>
                                                {isExpiringSoon && (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                        Expiring
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-white/40 mt-0.5">
                                                {formatGasUnits(credit.remainingGasUnits)} Reserved Units
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Locked Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="font-bold text-2xl text-green-400">{credit.lockedPriceGwei}</p>
                                                <p className="text-xs font-bold text-white/20">GWEI</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Current Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className={`font-bold text-2xl ${isBeneficial ? "text-red-400" : "text-white/60"}`}>
                                                    {currentPrice}
                                                </p>
                                                <p className="text-xs font-bold text-white/20">GWEI</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Est. Savings</p>
                                            <p className={`font-bold text-2xl ${isBeneficial ? "bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent" : "text-white/20"}`}>
                                                {isBeneficial ? `${savingsPercent}%` : "0%"}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Expires In</p>
                                            <p className={`font-bold text-2xl flex items-center gap-2 ${isExpiringSoon ? "text-amber-500" : "text-white/60"}`}>
                                                {credit.daysUntilExpiry}d
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex lg:justify-end lg:w-48">
                                        <button
                                            onClick={() => {
                                                setSelectedCredit(credit);
                                                setRedeemAmount(credit.remainingGasUnits);
                                                setShowRedeemModal(true);
                                            }}
                                            className="group/btn relative w-full lg:w-auto px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-3 overflow-hidden active:scale-[0.98]"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                            <span className="relative z-10 uppercase tracking-widest text-xs">Redeem</span>
                                            <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        onClick={() => setShowRedeemModal(false)}
                    />
                    <div className="bg-[#12121e]/95 border border-white/10 backdrop-blur-2xl px-6 py-5 rounded-[1.5rem] max-w-md w-full relative z-50 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.7),0_0_1px_1px_rgba(255,255,255,0.05)] max-h-[80vh] flex flex-col overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/15 rounded-full blur-[60px] pointer-events-none" />

                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                    Redeem Savings
                                </h3>
                                <p className="text-xs text-white/30 truncate">Claim your locked-in gas benefits</p>
                            </div>
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar space-y-4">
                            {/* Selection Cards (Compact) */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setRedeemType("cash")}
                                    className={`relative group p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${redeemType === "cash"
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${redeemType === "cash" ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/40"}`}>
                                        <Wallet className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-bold truncate ${redeemType === "cash" ? "text-white" : "text-white/60"}`}>Cash Out</p>
                                        <p className="text-[10px] text-white/30 truncate">USDC</p>
                                    </div>
                                    {redeemType === "cash" && <CheckCircle className="absolute top-2 right-2 w-3 h-3 text-primary" />}
                                </button>

                                <button
                                    onClick={() => setRedeemType("crosschain")}
                                    className={`relative group p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${redeemType === "crosschain"
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${redeemType === "crosschain" ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/40"}`}>
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-bold truncate ${redeemType === "crosschain" ? "text-white" : "text-white/60"}`}>Cross-Gas</p>
                                        <p className="text-[10px] text-white/30 truncate">Move Gas</p>
                                    </div>
                                    {redeemType === "crosschain" && <CheckCircle className="absolute top-2 right-2 w-3 h-3 text-primary" />}
                                </button>
                            </div>

                            {/* Input Section (Compact) */}
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-white/30 text-left">Redeem Amount</label>
                                    <button
                                        onClick={() => setRedeemAmount(selectedCredit.remainingGasUnits)}
                                        className="text-[10px] font-bold text-primary hover:underline"
                                    >
                                        MAX: {formatGasUnits(selectedCredit.remainingGasUnits)}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={redeemAmount}
                                        onChange={(e) => setRedeemAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-white/5 border-white/10 rounded-lg px-3 py-2 text-lg font-bold focus:ring-1 focus:ring-primary/40 outline-none text-left"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20">GAS</div>
                                </div>
                            </div>

                            {/* Cross-chain destination (Compact) */}
                            {redeemType === "crosschain" && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-white/30 block text-left">Destination Network</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CROSS_CHAIN_OPTIONS.map((chain) => (
                                            <button
                                                key={chain.chainId}
                                                onClick={() => setSelectedDestChain(chain.chainId)}
                                                className={`p-2 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 ${selectedDestChain === chain.chainId
                                                    ? "border-primary bg-primary/10 text-white"
                                                    : "border-white/5 bg-white/5 text-white/40 hover:text-white"
                                                    }`}
                                            >
                                                <span className="text-lg leading-none">{chain.icon}</span>
                                                <span className="text-[8px] font-black uppercase tracking-tighter truncate w-full">{chain.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {lifiEstimate && (
                                        <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Coins className="w-3 h-3 text-primary" />
                                                <div className="text-left">
                                                    <p className="text-[8px] font-black text-white/30 uppercase leading-none mb-1">Est. Receive</p>
                                                    <p className="text-[10px] font-bold text-white leading-none">
                                                        {lifiEstimate.receivedAmount} {lifiEstimate.symbol}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-white/30 uppercase mb-1 leading-none">Duration</p>
                                                <p className="text-[10px] font-bold text-green-400 leading-none">{lifiEstimate.duration}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons (Compact) */}
                        <div className="flex gap-3 mt-5 flex-shrink-0 pt-2 border-t border-white/5">
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRedeem}
                                disabled={isRedeeming || !redeemAmount}
                                className="flex-[1.8] px-4 py-3 bg-primary text-primary-foreground disabled:opacity-50 rounded-xl text-xs font-black transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2"
                            >
                                {isRedeeming ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <>
                                        Confirm
                                        <CheckCircle className="w-3 h-3" />
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
