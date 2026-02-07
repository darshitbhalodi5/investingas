"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Fuel, AlertCircle, CheckCircle, ArrowRight, Info, Loader2 } from "lucide-react";
import { usePurchaseCredits, useUSDCBalance } from "@/hooks/useGasFutures";
import { useAllGasPrices, useGasUnitsCalculator } from "@/hooks/useGasPrices";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { RiGasStationLine } from "react-icons/ri";

const MIN_PURCHASE_AMOUNT = 1;

export default function BuyCreditsPage() {
    const { isConnected } = useAccount();
    const [selectedChain, setSelectedChain] = useState("ethereum");
    const [amount, setAmount] = useState("");
    const [expiry, setExpiry] = useState(30);
    const [success, setSuccess] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    // Contract hooks
    const { purchaseCredits, isPending, isApproving, purchaseSuccess } = usePurchaseCredits();
    const { balance: usdcBalance, isLoading: balanceLoading } = useUSDCBalance();
    const { prices, isLoading: pricesLoading } = useAllGasPrices();

    // Calculate gas units
    const { gasUnits, estimatedTxs } = useGasUnitsCalculator(amount, selectedChain);

    const selectedChainData = prices.find(p => p.chain === selectedChain);
    const usdcAmount = parseFloat(amount) || 0;
    const fee = usdcAmount * 0.005; // 0.5% fee
    const netAmount = usdcAmount - fee;
    const hasInsufficientBalance = usdcAmount > parseFloat(usdcBalance);

    // Handle purchase success
    useEffect(() => {
        if (purchaseSuccess) {
            setSuccess(true);
        }
    }, [purchaseSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || usdcAmount < MIN_PURCHASE_AMOUNT || hasInsufficientBalance) return;

        try {
            await purchaseCredits(amount, selectedChain, expiry);
        } catch (error) {
            console.error("Purchase failed:", error);
        }
    };

    if (!isConnected) {
        return (
            <ConnectWalletPrompt
                title="Connect to Buy Credits"
                description="Connect your wallet to purchase gas credits at today's prices."
                icon={RiGasStationLine}
            />
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
                    Your gas credits have been locked in at {selectedChainData?.priceGwei} gwei for {expiry} days.
                </p>
                {txHash && (
                    <p className="text-sm text-white/40 mb-4">
                        Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                )}
                <div className="flex gap-4">
                    <button onClick={() => { setSuccess(false); setAmount(""); }} className="px-6 py-3 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.1] transition-all font-semibold">
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
                {!balanceLoading && (
                    <p className="text-sm text-white/40 mt-2">
                        USDC Balance: <span className="text-white font-medium">${parseFloat(usdcBalance).toLocaleString()}</span>
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Chain Selection */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <label className="block text-sm font-medium text-white/60 mb-4">
                        Select Chain {pricesLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" />}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {prices.map((chain) => (
                            <button
                                key={chain.chain}
                                type="button"
                                onClick={() => setSelectedChain(chain.chain)}
                                className={`p-4 rounded-xl border transition-all text-left ${selectedChain === chain.chain
                                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20 text-white/70"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{chain.chainName}</span>
                                    {chain.isBuySignal && (
                                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                                            Good price
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">{chain.priceGwei}</span>
                                    <span className="text-white/40 text-sm">gwei</span>
                                    <span className={`text-xs ml-auto ${chain.change24h < 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {chain.change24h > 0 ? '+' : ''}{chain.change24h}%
                                    </span>
                                </div>
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
                            min={MIN_PURCHASE_AMOUNT}
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
                    {usdcAmount > 0 && usdcAmount < MIN_PURCHASE_AMOUNT && (
                        <p className="mt-3 text-sm text-amber-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Minimum purchase is ${MIN_PURCHASE_AMOUNT}
                        </p>
                    )}
                    {hasInsufficientBalance && usdcAmount >= MIN_PURCHASE_AMOUNT && (
                        <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Insufficient USDC balance
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
                {usdcAmount >= MIN_PURCHASE_AMOUNT && (
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                        <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Chain</span>
                                <span className="font-medium">{selectedChainData?.chainName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-white/60">Locked Price</span>
                                <span className="font-medium text-green-400">{selectedChainData?.priceGwei} gwei</span>
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
                                <span className="font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    ~{gasUnits} ({estimatedTxs.toLocaleString()} txs)
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-white/70">
                                Your credits will be locked at {selectedChainData?.priceGwei} gwei for {expiry} days.
                                You can redeem them anytime when gas prices are higher to save money.
                            </p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={usdcAmount < MIN_PURCHASE_AMOUNT || isPending || hasInsufficientBalance}
                    className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isApproving ? "Approving USDC..." : "Purchasing..."}
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
