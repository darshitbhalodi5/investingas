"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, TrendingUp, Clock, ArrowRight, Fuel, Zap, Shield } from "lucide-react";
import Link from "next/link";

// Mock data for demo
const MOCK_CREDITS = [
    { id: 0, chain: "Ethereum", locked: 8, current: 24, units: "500K", expiry: "12 days", savings: 66 },
    { id: 1, chain: "Base", locked: 0.3, current: 0.5, units: "2M", expiry: "25 days", savings: 40 },
    { id: 2, chain: "Polygon", locked: 30, current: 55, units: "800K", expiry: "8 days", savings: 45 },
];

export default function DashboardPage() {
    const { isConnected, address } = useAccount();

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                    <Wallet className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Connect your wallet to view your gas credits, track savings, and buy new credits.
                </p>
                <ConnectButton />
            </div>
        );
    }

    const totalSavings = MOCK_CREDITS.reduce((acc, c) => acc + c.savings, 0);
    const totalCredits = MOCK_CREDITS.length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-white/60">
                        Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                </div>
                <Link href="/dashboard/buy" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25">
                    <Fuel className="w-5 h-5" />
                    Buy Gas Credits
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Total Savings</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">${totalSavings.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <p className="text-green-400 text-sm mt-4">+12.5% this week</p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Active Credits</p>
                            <p className="text-3xl font-bold">{totalCredits}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/20">
                            <Zap className="w-6 h-6 text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-white/40 text-sm mt-4">Across 3 chains</p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Next Expiry</p>
                            <p className="text-3xl font-bold">8 days</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/20">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                    </div>
                    <p className="text-amber-500 text-sm mt-4">Polygon credit expiring soon</p>
                </div>
            </div>

            {/* Active Credits */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Your Gas Credits</h2>
                    <Link href="/dashboard/credits" className="text-indigo-400 text-sm flex items-center gap-1 hover:text-indigo-300 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {MOCK_CREDITS.map((credit) => {
                        const savingsPercent = ((credit.current - credit.locked) / credit.current * 100).toFixed(0);
                        const isGoodDeal = credit.current > credit.locked;

                        // Chain colors mapping
                        const chainColors = {
                            "Ethereum": "bg-[#627eea]",
                            "Base": "bg-[#0052ff]",
                            "Polygon": "bg-[#8247e5]",
                            "Arbitrum": "bg-[#28a0f0]"
                        };

                        return (
                            <div key={credit.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 gap-4 hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${chainColors[credit.chain as keyof typeof chainColors] || 'bg-gray-600'}`}>
                                        {credit.chain.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{credit.chain}</p>
                                        <p className="text-sm text-white/40">{credit.units} gas units</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="text-center min-w-[80px]">
                                        <p className="text-sm text-white/40">Locked</p>
                                        <p className="font-semibold text-green-400">{credit.locked} gwei</p>
                                    </div>
                                    <div className="text-center min-w-[80px]">
                                        <p className="text-sm text-white/40">Current</p>
                                        <p className={`font-semibold ${isGoodDeal ? "text-red-400" : "text-white/60"}`}>
                                            {credit.current} gwei
                                        </p>
                                    </div>
                                    <div className="text-center min-w-[80px]">
                                        <p className="text-sm text-white/40">Savings</p>
                                        <p className="font-semibold text-green-400">{savingsPercent}%</p>
                                    </div>
                                    <div className="text-center min-w-[80px]">
                                        <p className="text-sm text-white/40">Expires</p>
                                        <p className="font-semibold">{credit.expiry}</p>
                                    </div>

                                    <button
                                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${isGoodDeal
                                                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
                                                : "bg-white/5 text-white/40 border border-white/5 cursor-not-allowed"
                                            }`}
                                        disabled={!isGoodDeal}
                                    >
                                        {isGoodDeal ? "Redeem" : "Wait"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/buy" className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Fuel className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Buy More Credits</h3>
                            <p className="text-sm text-white/40">Lock in today&apos;s low gas prices</p>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-auto text-white/40 group-hover:text-indigo-400 transition-colors" />
                    </div>
                </Link>

                <Link href="/dashboard/analytics" className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-500/20 group-hover:scale-110 transition-transform">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">View Analytics</h3>
                            <p className="text-sm text-white/40">Track your savings over time</p>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-auto text-white/40 group-hover:text-cyan-400 transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
