"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { RiGasStationLine, RiCloseLine, RiWallet3Fill, RiFlashlightFill, RiExchangeFundsLine, RiCheckboxCircleFill, RiLoader4Line, RiHistoryLine, RiTimerLine, RiArrowRightLine, RiInformationLine, RiCheckboxBlankCircleFill, RiAlertLine } from "react-icons/ri";
import Link from "next/link";
import { useUserCredits, useRedeemCredits, useCalculateSavings, GasCredit } from "@/hooks/useGasFutures";
import { useAllGasPrices } from "@/hooks/useGasPrices";
import { CROSS_CHAIN_OPTIONS, getMockLifiQuote, formatLifiEstimate } from "@/lib/lifi";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { Button } from "@/components/ui/Button";

// Chain colors mapping
const chainColors: Record<string, string> = {
    "ethereum": "bg-[#627eea]",
    "base": "bg-[#0052ff]",
    "polygon": "bg-[#8247e5]",
    "arbitrum": "bg-[#28a0f0]",
    "optimism": "bg-[#ff0420]",
};

const THEME = {
    background: "#1A120B",
    foreground: "#E5E5CB",
    primary: "#D5CEA3",
    secondary: "#3C2A21",
    border: "#3C2A21",
};

export default function CreditsComponent() {
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

    const getChainIcon = (chainName: string) => {
        const option = CROSS_CHAIN_OPTIONS.find(c =>
            c.name.toLowerCase() === chainName.toLowerCase() ||
            (chainName.toLowerCase() === 'polygon' && c.name.toLowerCase().includes('polygon'))
        );
        return option?.icon || chainName.charAt(0).toUpperCase();
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
            {/* Header */}
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 px-1 sm:px-0">
                <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-3xl font-bold mb-0.5 sm:mb-1">
                        Portfolio
                    </h1>
                    <p className="text-xs sm:text-base text-white/40 font-medium">
                        Active Gas Positions
                    </p>
                </div>
                <Link href="/dashboard/buy" className="sm:inline-flex hidden">
                    <Button className="gap-2 px-6 h-11 uppercase font-black tracking-widest text-[10px]">
                        <RiGasStationLine className="w-4 h-4" />
                        Accumulate
                    </Button>
                </Link>
                {/* Mobile Floating/Compact button if needed, but for now just standard link */}
                <Link href="/dashboard/buy" className="sm:hidden w-full">
                    <Button className="w-full gap-2 h-12 text-[10px] font-black tracking-[0.2em] uppercase">
                        <RiGasStationLine className="w-4 h-4 text-primary" />
                        Accumulate Gas
                    </Button>
                </Link>
            </div>

            {/* Credits Grid */}
            {creditsLoading ? (
                <div className="flex items-center justify-center py-16 sm:py-32">
                    <div className="relative scale-75 sm:scale-100">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <RiLoader4Line className="w-6 h-6 sm:w-8 h-8 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
            ) : credits.length === 0 ? (
                <div className="text-center py-12 sm:py-20 bg-[#D5CEA3]/5 border border-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[3rem] relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="relative z-10 px-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-xl shadow-primary/5">
                            <RiTimerLine className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-widest mb-2">No Active Positions</h3>
                        <p className="text-xs sm:text-base text-white/30 mb-8 max-w-[280px] sm:max-w-md mx-auto leading-relaxed">
                            Start hedging against gas spikes today by securing your first position.
                        </p>
                        <Link href="/dashboard/buy">
                            <Button className="h-14 px-10 gap-3 font-black uppercase tracking-[0.2em] text-[11px]">
                                Secure Position
                                <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </Button>
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
                                className="group relative bg-[#3C2A21]/40 border border-[#3C2A21]/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] hover:bg-[#3C2A21]/60 transition-all duration-300 overflow-hidden"
                            >
                                {/* Subtle indicator line for the chain */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1 ${chainColors[credit.targetChain] || 'bg-[#3C2A21]'} opacity-30`} />

                                <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-8 relative z-10">
                                    {/* Chain & Overview */}
                                    <div className="flex items-center gap-4 lg:w-64">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg ring-4 ring-[#D5CEA3]/5 shrink-0 text-white">
                                            {getChainIcon(credit.targetChain)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                                <p className="font-black text-lg sm:text-xl capitalize tracking-tight truncate uppercase text-[#E5E5CB]">{credit.targetChain}</p>
                                                {isExpiringSoon && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                                )}
                                            </div>
                                            <p className="text-[10px] sm:text-sm font-bold text-white/30 uppercase tracking-tighter">
                                                {formatGasUnits(credit.remainingGasUnits)} units
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 flex-1">
                                        <div className="space-y-0.5 sm:space-y-1">
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Locked</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="font-bold text-lg sm:text-2xl text-white/30">{credit.lockedPriceGwei.toFixed(4)}</p>
                                                <p className="text-[10px] font-bold text-white/30">GWEI</p>
                                            </div>
                                        </div>

                                        <div className="space-y-0.5 sm:space-y-1">
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Current</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className={`font-bold text-lg sm:text-2xl ${isBeneficial ? "text-red-400" : "text-white/30"}`}>
                                                    {currentPrice.toFixed(4)}
                                                </p>
                                                <p className="text-[10px] font-bold text-white/30">GWEI</p>
                                            </div>
                                        </div>

                                        <div className="space-y-0.5 sm:space-y-1">
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Savings</p>
                                            <p className={`font-bold text-lg sm:text-2xl ${isBeneficial ? "bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent" : "text-white/30"}`}>
                                                {isBeneficial ? `${savingsPercent}%` : "0%"}
                                            </p>
                                        </div>

                                        <div className="space-y-0.5 sm:space-y-1">
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Expiry</p>
                                            <p className={`font-bold text-lg sm:text-2xl flex items-center gap-2 ${isExpiringSoon ? "text-amber-500" : "text-white/30"}`}>
                                                {credit.daysUntilExpiry}d
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex lg:justify-end lg:w-48 pt-2 sm:pt-0 border-t border-[#3C2A21]/50 sm:border-0">
                                        <button
                                            onClick={() => {
                                                setSelectedCredit(credit);
                                                setRedeemAmount(credit.remainingGasUnits);
                                                setShowRedeemModal(true);
                                            }}
                                            className="group/btn relative w-full lg:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-primary text-primary-foreground font-black rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-primary/10 hover:shadow-primary/30 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] border border-[#D5CEA3]/20"
                                        >
                                            <div className="absolute inset-0 bg-[#D5CEA3]/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                            <span className="relative z-10 uppercase tracking-[0.2em] text-[10px] sm:text-xs">Redeem</span>
                                            <RiFlashlightFill className="w-3.5 h-3.5 relative z-10 group-hover/btn:scale-110 transition-transform fill-current" />
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
                        className="absolute inset-0 bg-[#1A120B]/80 backdrop-blur-md transition-opacity"
                        onClick={() => setShowRedeemModal(false)}
                    />
                    <div className="bg-[#3C2A21] border border-[#D5CEA3]/20 backdrop-blur-3xl px-6 py-6 rounded-[2.5rem] max-w-[420px] w-full relative z-50 shadow-[0_0_80px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between mb-8 flex-shrink-0 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-[0.1em] text-[#E5E5CB]">
                                    Redeem Credits
                                </h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <p className="text-[10px] font-black text-[#D5CEA3]/40 uppercase tracking-[0.2em]">{selectedCredit.targetChain} Network</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#1A120B]/50 text-[#D5CEA3]/40 hover:text-[#E5E5CB] hover:bg-[#1A120B] transition-all border border-[#D5CEA3]/10 active:scale-95 group"
                            >
                                <RiCloseLine className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar space-y-8 relative z-10 pb-4">
                            {/* Type Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setRedeemType("cash")}
                                    className={`relative group p-5 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-3 text-center ${redeemType === "cash"
                                        ? "border-primary bg-primary/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                                        : "border-[#D5CEA3]/10 bg-[#1A120B]/30 hover:border-[#D5CEA3]/30 hover:bg-[#1A120B]/50"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${redeemType === "cash" ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(213,206,163,0.3)]" : "bg-[#1A120B]/40 text-[#D5CEA3]/20 group-hover:text-[#D5CEA3]/60"}`}>
                                        <RiWallet3Fill className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${redeemType === "cash" ? "text-[#E5E5CB]" : "text-[#D5CEA3]/30"}`}>Cash Out</span>
                                    {redeemType === "cash" && (
                                        <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(213,206,163,0.8)]" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setRedeemType("crosschain")}
                                    className={`relative group p-5 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center gap-3 text-center ${redeemType === "crosschain"
                                        ? "border-primary bg-primary/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                                        : "border-[#D5CEA3]/10 bg-[#1A120B]/30 hover:border-[#D5CEA3]/30 hover:bg-[#1A120B]/50"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${redeemType === "crosschain" ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(213,206,163,0.3)]" : "bg-[#1A120B]/40 text-[#D5CEA3]/20 group-hover:text-[#D5CEA3]/60"}`}>
                                        <RiFlashlightFill className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${redeemType === "crosschain" ? "text-[#E5E5CB]" : "text-[#D5CEA3]/30"}`}>Cross-Gas</span>
                                    {redeemType === "crosschain" && (
                                        <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(213,206,163,0.8)]" />
                                    )}
                                </button>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end px-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Redemption Amount</label>
                                    <button
                                        onClick={() => setRedeemAmount(selectedCredit.remainingGasUnits)}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary/80 hover:text-primary transition-all flex items-center gap-2 group/max"
                                    >
                                        <span className="text-[#D5CEA3]/20">Available:</span>
                                        <span className="bg-primary/10 px-2 py-0.5 rounded-full group-hover/max:bg-primary/20 transition-colors">
                                            {formatGasUnits(selectedCredit.remainingGasUnits)}
                                        </span>
                                    </button>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={redeemAmount}
                                        onChange={(e) => setRedeemAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#1A120B]/40 border-2 border-[#D5CEA3]/10 rounded-[1.5rem] px-6 py-5 text-3xl font-black focus:border-primary/40 focus:bg-[#1A120B]/60 outline-none transition-all placeholder:text-[#D5CEA3]/5 text-[#E5E5CB]"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <div className="w-[1px] h-6 bg-[#D5CEA3]/10" />
                                        <span className="text-sm font-black uppercase tracking-[0.2em]">Units</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cross-chain UI */}
                            {redeemType === "crosschain" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 px-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] block">Destination Network</label>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2.5">
                                            {CROSS_CHAIN_OPTIONS.map((chain) => (
                                                <button
                                                    key={chain.chainId}
                                                    onClick={() => setSelectedDestChain(chain.chainId)}
                                                    className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-2 ${selectedDestChain === chain.chainId
                                                        ? "border-primary bg-white/5 shadow-[0_0_20px_rgba(213,206,163,0.1)]"
                                                        : "border-[#D5CEA3]/5 bg-white/5 hover:border-[#D5CEA3]/20 hover:text-[#E5E5CB]/60"
                                                        }`}
                                                >
                                                    <span className="text-2xl leading-none">{chain.icon}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-tighter truncate w-full text-center">{chain.name.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-[#D5CEA3]/10 relative z-10">
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="flex-1 px-6 py-4.5 bg-[#1A120B]/40 hover:bg-[#1A120B]/60 text-[#D5CEA3] text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-[#D5CEA3]/10 hover:border-[#D5CEA3]/20 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRedeem}
                                disabled={isRedeeming || !redeemAmount}
                                className="flex-[1.8] px-6 py-4.5 bg-primary text-primary-foreground disabled:opacity-30 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_15px_40px_rgba(213,206,163,0.2)] hover:shadow-[0_15px_50px_rgba(213,206,163,0.4)] flex items-center justify-center gap-3 border border-white/20 active:scale-[0.98] group"
                            >
                                {isRedeeming ? (
                                    <RiLoader4Line className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Confirm
                                        <RiCheckboxCircleFill className="w-5 h-5 transition-transform group-hover:scale-125" />
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
