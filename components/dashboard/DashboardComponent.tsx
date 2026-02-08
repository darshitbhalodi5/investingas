"use client";

import { useAccount } from "wagmi";
import { RiGasStationLine, RiFlashlightLine, RiArrowRightLine, RiHistoryLine, RiTimerLine, RiWallet3Fill, RiLineChartFill, RiFlashlightFill, RiShieldCheckLine } from "react-icons/ri";
import Link from "next/link";
import { useUserCredits, useUserStats } from "@/hooks/useGasFutures";
import { useAllGasPrices } from "@/hooks/useGasPrices";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { Button } from "@/components/ui/Button";
import { CROSS_CHAIN_OPTIONS } from "@/lib/lifi";

// Chain colors mapping
const chainColors: Record<string, string> = {
    "ethereum": "bg-[#627eea]",
    "base": "bg-[#0052ff]",
    "polygon": "bg-[#8247e5]",
    "arbitrum": "bg-[#28a0f0]",
    "optimism": "bg-[#ff0420]",
};

export default function DashboardComponent() {
    const { isConnected, address } = useAccount();

    // Contract hooks
    const { credits, isLoading: creditsLoading, activeCredits } = useUserCredits();
    const { totalSavings, totalPayouts } = useUserStats();
    const { prices } = useAllGasPrices();

    if (!isConnected) {
        return (
            <ConnectWalletPrompt
                title="Connect Your Wallet"
                description="Connect your wallet to view your gas credits, track savings, and buy new credits."
                icon={RiWallet3Fill}
            />
        );
    }

    // Helper functions
    const formatGasUnits = (units: string) => {
        const num = parseFloat(units);
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return units;
    };

    const getChainIcon = (chainName: string) => {
        const option = CROSS_CHAIN_OPTIONS.find(c =>
            c.name.toLowerCase() === chainName.toLowerCase() ||
            (chainName.toLowerCase() === 'polygon' && c.name.toLowerCase().includes('polygon'))
        );
        return option?.icon || chainName.charAt(0).toUpperCase();
    };

    const getChainCurrentPrice = (chainId: string) => {
        const price = prices.find(p => p.chain === chainId);
        return price?.priceGwei || 0;
    };

    // Calculate stats
    const nearestExpiry = credits.length > 0
        ? credits.reduce((min, c) => c.daysUntilExpiry < min.daysUntilExpiry ? c : min, credits[0])
        : null;

    const uniqueChainsCount = [...new Set(credits.map(c => c.targetChain))].length;

    return (
        <div className="space-y-8 sm:space-y-12 pb-12">
            {/* Dashboard Header - More Compact Scale */}
            <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
                <div className="relative flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-full blur-sm opacity-50 hidden sm:block" />
                    <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#E5E5CB] mb-1">
                        Dashboard
                    </h1>
                    <p className="text-[10px] sm:text-xs text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center sm:justify-start gap-2">
                        <RiShieldCheckLine className="text-primary/40" />
                        TERMINAL ACTIVE: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                </div>
                <Link href="/dashboard/buy" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 px-5 h-10 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(213,206,163,0.2)] transition-all active:scale-95 group">
                        <RiGasStationLine className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Accumulate Gas
                    </Button>
                </Link>
            </div>

            {/* Stats Grid - Kept for context but refined if needed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {/* Total Savings Card */}
                <div className="group relative bg-[#3C2A21]/20 border border-white/5 backdrop-blur-2xl p-6 rounded-[2rem] transition-all hover:bg-[#3C2A21]/30 hover:translate-y-[-2px] overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <RiLineChartFill className="w-20 h-20 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E5E5CB]/40 mb-4">Capital Optimized</p>
                        <h3 className="text-3xl sm:text-4xl font-black text-[#E5E5CB] tracking-tight mb-1">
                            ${parseFloat(totalSavings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">
                            + ${parseFloat(totalPayouts).toFixed(2)} Secured
                        </p>
                    </div>
                </div>

                {/* Active Credits Card */}
                <div className="group relative bg-[#3C2A21]/20 border border-white/5 backdrop-blur-2xl p-6 rounded-[2rem] transition-all hover:bg-[#3C2A21]/30 hover:translate-y-[-2px] overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <RiFlashlightFill className="w-20 h-20 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E5E5CB]/40 mb-4">Active Positions</p>
                        <h3 className="text-3xl sm:text-4xl font-black text-[#E5E5CB] tracking-tight mb-1">{activeCredits}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                            {uniqueChainsCount} Networks Covered
                        </p>
                    </div>
                </div>

                {/* Expiry Card */}
                <div className="group relative bg-[#3C2A21]/20 border border-white/5 backdrop-blur-2xl p-6 rounded-[2rem] transition-all hover:bg-[#3C2A21]/30 hover:translate-y-[-2px] overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <RiTimerLine className="w-20 h-20 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E5E5CB]/40 mb-4">Closest Window</p>
                        <h3 className={`text-3xl sm:text-4xl font-black tracking-tight mb-1 ${nearestExpiry && nearestExpiry.daysUntilExpiry <= 7 ? 'text-amber-500' : 'text-[#E5E5CB]'}`}>
                            {nearestExpiry ? `${nearestExpiry.daysUntilExpiry}d` : 'NA'}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#E5E5CB]/20">
                            {nearestExpiry ? `Next: ${nearestExpiry.targetChain}` : 'No Pending Expirations'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
                {/* Active Credits List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-0.5">
                            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#E5E5CB]">Strategic Positions</h2>
                            <p className="text-[9px] font-bold text-white/50 tracking-[0.3em]">Institutional Grade Gas Hedging</p>
                        </div>
                        <Link href="/dashboard/credits" className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#D5CEA3]/40 hover:text-primary transition-all">
                            Historical Data <RiArrowRightLine className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {creditsLoading ? (
                            <div className="grid gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 bg-[#3C2A21]/10 rounded-2xl animate-pulse border border-white/5" />
                                ))}
                            </div>
                        ) : credits.length === 0 ? (
                            <div className="group relative bg-[#3C2A21]/10 border border-white/5 rounded-[2rem] p-12 sm:p-24 text-center border-dashed hover:bg-[#3C2A21]/20 transition-all overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <RiGasStationLine className="w-10 h-10 text-primary/20 mb-4" />
                                    <h3 className="text-lg font-black uppercase tracking-widest text-[#E5E5CB] mb-2">No Active Inventory</h3>
                                    <p className="text-[9px] font-bold text-white/50 tracking-[0.2em] mb-8 max-w-[180px] mx-auto leading-relaxed">
                                        Acquire gas units to lock in current market rates.
                                    </p>
                                    <Link href="/dashboard/buy">
                                        <Button className="h-10 px-6 gap-2 group/btn rounded-lg bg-primary hover:bg-primary border-white/5 hover:border-transparent text-white/40 hover:text-primary-foreground font-black uppercase tracking-widest text-[10px]">
                                            Open Position
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                {credits.slice(0, 4).map((credit) => {
                                    const currentPrice = getChainCurrentPrice(credit.targetChain);
                                    const isBeneficial = currentPrice > credit.lockedPriceGwei;
                                    const savingsPercent = isBeneficial && currentPrice > 0
                                        ? Math.round(((currentPrice - credit.lockedPriceGwei) / currentPrice) * 100)
                                        : 0;
                                    const chainColor = chainColors[credit.targetChain.toLowerCase()] || "bg-primary";

                                    return (
                                        <div
                                            key={credit.id}
                                            className="group relative bg-[#3C2A21]/20 border border-white/5 hover:bg-[#3C2A21]/40 backdrop-blur-xl p-3 sm:p-4 rounded-xl transition-all duration-300 hover:translate-x-1"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-[#1A120B] border border-white/5 flex items-center justify-center text-lg shadow-lg group-hover:ring-1 group-hover:ring-primary/30 transition-all">
                                                        {getChainIcon(credit.targetChain)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h4 className="font-black text-sm uppercase tracking-tight text-[#E5E5CB]">{credit.targetChain}</h4>
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/5 rounded border border-white/5">
                                                                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                                <span className="text-[7px] font-black uppercase tracking-widest text-primary/60">Active</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#E5E5CB]/20">
                                                            {formatGasUnits(credit.remainingGasUnits)} UNITS SECURED
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t border-white/5 sm:border-0 pt-2 sm:pt-0">
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10 mb-0.5">Locked Rate</p>
                                                        <p className="font-black text-lg text-[#E5E5CB]">
                                                            {credit.lockedPriceGwei.toFixed(2)} <span className="text-[9px] opacity-20">GWEI</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end min-w-[100px]">
                                                        <div className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest mb-1.5 transition-all ${isBeneficial ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-white/5 text-white/20 border border-white/5"}`}>
                                                            {isBeneficial ? `${savingsPercent}% Optimized` : "Market Neutral"}
                                                        </div>
                                                        <Link href={`/dashboard/credits?redeem=${credit.id}`} className="text-[8px] font-black uppercase tracking-widest text-[#D5CEA3]/30 hover:text-primary transition-colors flex items-center gap-1 group/link">
                                                            Settle Position <RiArrowRightLine className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-4">
                        <div className="px-1">
                            <h2 className="text-lg font-black uppercase tracking-tight text-[#E5E5CB]">Tactical Alpha</h2>
                            <p className="text-[9px] font-bold text-white/50 tracking-[0.3em] mt-0.5">Heuristics & Signals</p>
                        </div>

                        {/* Featured Strategy */}
                        <Link href="/dashboard/analytics" className="group relative bg-[#3C2A21]/30 border border-primary/10 rounded-2xl p-5 overflow-hidden hover:bg-[#3C2A21]/50 hover:border-primary/20 transition-all active:scale-[0.98] block shadow-2xl">
                            <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                                <RiLineChartFill className="w-24 h-24 text-primary" />
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded border border-primary/20 mb-3">
                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Signal Delta</span>
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight leading-none mb-2 text-[#E5E5CB]">Market Hedging</h3>
                                <p className="text-[9px] font-bold tracking-widest mb-6 text-white/50 leading-relaxed">
                                    Gas trending 12.4% below 7d MA. Strategic accumulation recommended for high-throughput operations.
                                </p>
                                <div className="w-full h-9 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-transparent text-primary hover:text-primary-foreground flex items-center justify-center rounded-lg uppercase font-black tracking-[0.2em] text-[10px] transition-all">
                                    Analyze Pulse
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="space-y-2">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] px-1">Control Plane</p>
                        <div className="grid gap-2">
                            {[
                                { label: "Market Analytics", sub: "Trend Vectors", icon: RiLineChartFill, link: "/dashboard/analytics", color: "text-[#D5CEA3]" },
                                { label: "Purchase Gas", sub: "Open Inventory", icon: RiGasStationLine, link: "/dashboard/buy", color: "text-[#D5CEA3]" },
                                { label: "Terminal Logs", sub: "History", icon: RiHistoryLine, link: "/dashboard/credits", color: "text-[#D5CEA3]" },
                            ].map((item, i) => (
                                <Link key={i} href={item.link}>
                                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-[#3C2A21]/10 border border-white/5 hover:border-white/10 hover:bg-[#3C2A21]/30 transition-all active:scale-[0.98]">
                                        <div className={`w-8 h-8 rounded-lg bg-[#1A120B] flex items-center justify-center border border-white/5 ${item.color} shadow-lg transition-all group-hover:scale-105 group-hover:border-primary/20`}>
                                            <item.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-black text-[10px] uppercase tracking-tight text-[#E5E5CB] mb-0.5">{item.label}</p>
                                            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-primary/60 transition-colors uppercase">{item.sub}</p>
                                        </div>
                                        <RiArrowRightLine className="w-3 h-3 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
