"use client";

import { useAccount } from "wagmi";
import { BarChart3, TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { RiBarChartGroupedLine } from "react-icons/ri";

// Mock analytics data
const SAVINGS_HISTORY = [
    { date: "Jan 15", amount: 12.50, chain: "Ethereum" },
    { date: "Jan 18", amount: 8.20, chain: "Base" },
    { date: "Jan 22", amount: 25.80, chain: "Polygon" },
    { date: "Jan 28", amount: 15.40, chain: "Ethereum" },
    { date: "Feb 1", amount: 22.10, chain: "Arbitrum" },
];

const CHAIN_STATS = [
    { chain: "Ethereum", credits: 3, totalSavings: 45.50, avgSavings: 65, color: "bg-[#627eea]" },
    { chain: "Base", credits: 2, totalSavings: 12.30, avgSavings: 40, color: "bg-[#0052ff]" },
    { chain: "Polygon", credits: 1, totalSavings: 25.80, avgSavings: 55, color: "bg-[#8247e5]" },
    { chain: "Arbitrum", credits: 1, totalSavings: 22.10, avgSavings: 48, color: "bg-[#28a0f0]" },
];

export default function AnalyticsPage() {
    const { isConnected } = useAccount();

    if (!isConnected) {
        return (
            <ConnectWalletPrompt
                title="Connect to View Analytics"
                description="Connect your wallet to view your gas savings analytics and history."
                icon={RiBarChartGroupedLine}
            />
        );
    }

    const totalSavings = SAVINGS_HISTORY.reduce((acc, s) => acc + s.amount, 0);
    const totalTransactions = SAVINGS_HISTORY.length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-white/60">Track your gas savings over time</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20">
                            <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-white/60 text-sm">Total Saved</span>
                    </div>
                    <p className="text-2xl font-bold">${totalSavings.toFixed(2)}</p>
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                        <ArrowUpRight className="w-4 h-4" />
                        +18% this month
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/20">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-white/60 text-sm">Avg Savings</span>
                    </div>
                    <p className="text-2xl font-bold">52%</p>
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                        <ArrowUpRight className="w-4 h-4" />
                        Above market average
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-500/20">
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-white/60 text-sm">Transactions</span>
                    </div>
                    <p className="text-2xl font-bold">{totalTransactions}</p>
                    <p className="text-white/40 text-sm mt-2">All time redemptions</p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pink-500/20">
                            <Clock className="w-5 h-5 text-pink-400" />
                        </div>
                        <span className="text-white/60 text-sm">Best Timing</span>
                    </div>
                    <p className="text-2xl font-bold">3.2 days</p>
                    <p className="text-white/40 text-sm mt-2">Avg hold time</p>
                </div>
            </div>

            {/* Savings by Chain */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-6">Savings by Chain</h2>
                <div className="space-y-4">
                    {CHAIN_STATS.map((stat) => (
                        <div key={stat.chain} className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${stat.color}`}>
                                {stat.chain.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{stat.chain}</span>
                                    <span className="text-green-400 font-semibold">${stat.totalSavings.toFixed(2)}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-500"
                                        style={{ width: `${stat.avgSavings}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-white/40 text-sm w-16 text-right">{stat.avgSavings}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Savings */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-6">Recent Savings</h2>
                <div className="space-y-3">
                    {SAVINGS_HISTORY.map((saving, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20">
                                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="font-medium">{saving.chain} Redemption</p>
                                    <p className="text-sm text-white/40">{saving.date}</p>
                                </div>
                            </div>
                            <span className="text-green-400 font-semibold text-lg">+${saving.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl border-l-4 border-l-indigo-500">
                <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                <p className="text-white/60">
                    Gas prices are typically lowest on weekends and late at night (UTC).
                    Consider buying credits during these times for maximum savings potential.
                </p>
            </div>
        </div>
    );
}
