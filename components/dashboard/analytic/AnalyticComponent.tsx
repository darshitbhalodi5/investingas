"use client";

import { useState } from "react";

import { useAccount } from "wagmi";
import { BarChart3, TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight, AlertCircle, X } from "lucide-react";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { useUserCredits } from "@/hooks/useGasFutures";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock analytics data
const SAVINGS_HISTORY = [
    { date: "Jan 15", amount: 12.50, chain: "Ethereum", entryGwei: 15, exitGwei: 42 },
    { date: "Jan 18", amount: 8.20, chain: "Base", entryGwei: 1.2, exitGwei: 4.8 },
    { date: "Jan 22", amount: 25.80, chain: "Polygon", entryGwei: 120, exitGwei: 310 },
    { date: "Jan 28", amount: 15.40, chain: "Ethereum", entryGwei: 18, exitGwei: 35 },
    { date: "Feb 1", amount: 22.10, chain: "Arbitrum", entryGwei: 0.1, exitGwei: 0.9 },
    { date: "Feb 5", amount: -4.30, chain: "Ethereum", entryGwei: 45, exitGwei: 38 },
    { date: "Feb 7", amount: 18.40, chain: "OP Sepolia", entryGwei: 0.05, exitGwei: 0.25 },
];

const CHAIN_STATS = [
    { chain: "Ethereum", credits: 3, totalSavings: 45.50, avgSavings: 65, color: "#627eea" },
    { chain: "Base", credits: 2, totalSavings: 12.30, avgSavings: 40, color: "#0052ff" },
    { chain: "Polygon", credits: 1, totalSavings: 25.80, avgSavings: 55, color: "#8247e5" },
    { chain: "Arbitrum", credits: 1, totalSavings: 22.10, avgSavings: 48, color: "#28a0f0" },
    { chain: "OP Sepolia", credits: 2, totalSavings: 18.40, avgSavings: 42, color: "#ff0420" },
];

export default function AnalyticComponent() {
    const { isConnected } = useAccount();
    const { credits, isLoading } = useUserCredits();
    const [showBanner, setShowBanner] = useState(true);

    if (!isConnected) {
        return (
            <ConnectWalletPrompt
                title="Connect to View Analytics"
                description="Connect your wallet to view your gas savings analytics and history."
                icon={RiBarChartGroupedLine}
            />
        );
    }

    // Determine if we should show mock data
    // Show mock data if disconnected OR if user has no positions
    const showMockData = !isConnected || (credits.length === 0);

    const displaySavings = showMockData ? SAVINGS_HISTORY : [];
    const displayStats = showMockData ? CHAIN_STATS : [];

    const totalSavings = displaySavings.reduce((acc, s) => acc + s.amount, 0);
    const totalTransactions = displaySavings.length;

    return (
        <div className="space-y-8">
            {showMockData && showBanner && (
                <div className="bg-black/30 border border-black/20 rounded-xl p-3 sm:p-4 animate-in fade-in slide-in-from-top-2 duration-500 relative group">
                    <div className="flex items-center gap-3 sm:gap-4 pr-8">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 overflow-hidden">
                            <h3 className="text-sm font-bold  whitespace-nowrap">
                                {isConnected ? "PREVIEW MODE" : "GUEST PREVIEW"}
                            </h3>
                            <div className="hidden sm:block w-1 h-1 rounded-full bg-white" />
                            <p className="text-xs sm:text-sm text-white/60 truncate">
                                {isConnected
                                    ? "Showing mock data until your first redemption is verified."
                                    : "Connect wallet to view your personal gas savings analytics."
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-black/50 transition-all bg-[#D5CEA3]"
                        title="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-white/60">Track your gas savings over time</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#1A120B] border border-white/5 shrink-0">
                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <span className="text-white/40 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Total Saved</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-white tracking-tight">${totalSavings.toFixed(0)}</p>
                    </div>
                    <div className={`${showMockData ? "text-green-400" : "text-white/20"} text-[10px] sm:text-sm mt-3 sm:mt-4 flex items-center gap-1 font-bold`}>
                        {showMockData ? (
                            <>
                                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>+18%</span>
                            </>
                        ) : (
                            <span className="opacity-50 italic">No data</span>
                        )}
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#1A120B] border border-white/5 shrink-0">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <span className="text-white/40 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Avg Save</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{showMockData ? "52%" : "0%"}</p>
                    </div>
                    <div className={`${showMockData ? "text-green-400" : "text-white/20"} text-[10px] sm:text-sm mt-3 sm:mt-4 flex items-center gap-1 font-bold`}>
                        {showMockData ? (
                            <>
                                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Optimal</span>
                            </>
                        ) : (
                            <span className="opacity-50 italic">No data</span>
                        )}
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#1A120B] border border-white/5 shrink-0">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <span className="text-white/40 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Transact</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{totalTransactions}</p>
                    </div>
                    <div className="text-white/20 text-[10px] sm:text-sm mt-3 sm:mt-4 font-bold uppercase tracking-tighter">
                        Total Count
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-[#1A120B] border border-white/5 shrink-0">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                            </div>
                            <span className="text-white/40 text-[10px] sm:text-sm font-bold uppercase tracking-wider">Timing</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{showMockData ? "3.2d" : "0d"}</p>
                    </div>
                    <div className="text-white/20 text-[10px] sm:text-sm mt-3 sm:mt-4 font-bold uppercase tracking-tighter">
                        Hold Time
                    </div>
                </div>
            </div>

            {/* Savings by Chain */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-5 sm:p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-12 relative z-10">
                    {displayStats.length > 0 ? (
                        <>
                            <div className="w-full md:w-1/3 relative">
                                <div className="h-[240px] sm:h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={displayStats}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={85}
                                                outerRadius={115}
                                                paddingAngle={8}
                                                dataKey="totalSavings"
                                                nameKey="chain"
                                                stroke="none"
                                            >
                                                {displayStats.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-[#0f172a]/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                                                                    <p className="font-bold text-white text-sm uppercase tracking-wider">{data.chain}</p>
                                                                </div>
                                                                <p className="text-2xl font-black text-white">${data.totalSavings.toFixed(2)}</p>
                                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 gap-8">
                                                                    <span className="text-white/40 text-[10px] uppercase font-bold">Performance</span>
                                                                    <span className="text-green-400 text-xs font-bold">+{data.avgSavings}%</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Central Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-1">Total</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">${totalSavings.toFixed(0)}</p>
                                    <p className="text-green-400/60 text-[10px] font-bold mt-1">Realized</p>
                                </div>
                            </div>

                            <div className="flex-1 w-full flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {displayStats.map((stat) => (
                                        <div key={stat.chain} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden" style={{ backgroundColor: `${stat.color}20` }}>
                                                        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: stat.color }} />
                                                        <div className="w-1.5 h-1.5 rounded-full relative z-10" style={{ backgroundColor: stat.color }} />
                                                    </div>
                                                    <p className="text-sm font-bold uppercase tracking-widest">{stat.chain}</p>
                                                </div>
                                                <span className="text-xs font-black text-white/30">{((stat.totalSavings / totalSavings) * 100).toFixed(0)}%</span>
                                            </div>

                                            <div className="flex items-end justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-1 mb-2">
                                                        <span className="text-xs font-bold text-white/20">$</span>
                                                        <span className="text-xl font-black text-white tabular-nums tracking-tight">
                                                            {stat.totalSavings.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                                            style={{
                                                                width: `${(stat.totalSavings / totalSavings) * 100}%`,
                                                                backgroundColor: stat.color
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-[10px] font-black text-green-500/40 uppercase mb-0.5 tracking-tighter">Avg Save</p>
                                                    <p className="text-sm font-black text-green-400 tracking-tighter">{stat.avgSavings}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                            <BarChart3 className="w-12 h-12 text-white/5 mx-auto mb-4" />
                            <p className="text-white/20 font-medium tracking-wide">No distribution data available yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Savings */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-5 sm:p-8 rounded-3xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Recent Settlements</h2>
                        <p className="text-white/40 text-[10px] sm:text-sm mt-1">Real-time tracking of your gas redemptions</p>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    {displaySavings.length > 0 ? (
                        displaySavings.map((saving, idx) => {
                            const isLoss = saving.amount < 0;
                            const statusTheme = isLoss ? {
                                gradient: "from-orange-500/20",
                                iconColor: "text-orange-400",
                                glow: "drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]",
                                indicator: "from-orange-500/40"
                            } : {
                                gradient: "from-green-500/20",
                                iconColor: "text-green-400",
                                glow: "drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]",
                                indicator: "from-green-500/40"
                            };

                            return (
                                <div key={idx} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-4 sm:gap-5">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${statusTheme.gradient} to-transparent border border-white/10 shadow-inner relative shrink-0`}>
                                            {isLoss ? (
                                                <ArrowDownRight className={`w-6 h-6 sm:w-7 sm:h-7 ${statusTheme.iconColor} ${statusTheme.glow}`} />
                                            ) : (
                                                <ArrowUpRight className={`w-6 h-6 sm:w-7 sm:h-7 ${statusTheme.iconColor} ${statusTheme.glow}`} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <p className="font-bold text-white/90 text-base sm:text-lg leading-none truncate uppercase">{saving.chain}</p>
                                                <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
                                                <span className="text-[9px] sm:text-[10px] font-black text-white/70 uppercase tracking-[0.1em] sm:tracking-[0.15em]">{isLoss ? 'Settled' : 'Redeemed'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/40">
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3 text-white" />
                                                    <span className="underline">{saving.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 overflow-hidden">
                                                    <span className="text-[10px] text-white">Gas:</span>
                                                    <span className={`${isLoss ? 'text-orange-500/70' : 'text-green-500/70'} text-[10px] font-medium whitespace-nowrap`}>
                                                        {saving.entryGwei} → {saving.exitGwei}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
                                        <div className={`flex items-baseline gap-1 ${isLoss ? 'text-orange-400' : 'text-green-400'}`}>
                                            <span className="text-xs sm:text-sm font-bold opacity-60">$</span>
                                            <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tighter">
                                                {Math.abs(saving.amount).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:mt-1.5">
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${isLoss ? 'bg-orange-500/10 border-orange-500/20' : 'bg-green-500/10 border-green-500/20'} border`}>
                                                <div className={`h-1 w-1 rounded-full ${isLoss ? 'bg-orange-500' : 'bg-green-500'}`} />
                                                <p className={`text-[8px] sm:text-[9px] font-bold ${isLoss ? 'text-orange-500/80' : 'text-green-500/80'} uppercase tracking-tight sm:tracking-wider`}>
                                                    {isLoss ? 'Fluctuation' : 'Verified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b ${statusTheme.indicator} to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block`}></div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center mx-auto mb-6 border border-white/5 relative">
                                <Clock className="w-10 h-10 text-white/10" />
                                <div className="absolute inset-0 rounded-full border border-white/5 scale-125 opacity-50" />
                                <div className="absolute inset-0 rounded-full border border-white/5 scale-150 opacity-20" />
                            </div>
                            <h3 className="text-xl font-semibold text-white/60 mb-2">No Savings History</h3>
                            <p className="text-white/30 max-w-xs mx-auto">Visit the Dashboard to start building your gas credit portfolio.</p>
                            <button className="mt-8 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl border-l-4 border-l-white/80">
                <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                <p className="text-white/60">
                    Gas prices are typically lowest on weekends and late at night (UTC).                </p>
            </div>
        </div>
    );
}
