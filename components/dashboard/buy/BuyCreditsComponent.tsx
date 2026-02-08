"use client";

import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { AlertCircle, CheckCircle, ArrowRight, Info, Loader2 } from "lucide-react";
import { usePurchaseCredits, useUSDCBalance } from "@/hooks/useGasFutures";
import { useAllGasPrices, useGasUnitsCalculator } from "@/hooks/useGasPrices";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { SUPPORTED_CHAINS } from "@/lib/contracts";
import { RiGasStationLine } from "react-icons/ri";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const MIN_PURCHASE_AMOUNT = 1;

export default function BuyCreditsComponent() {
    const { isConnected, chainId } = useAccount();
    const { switchChain } = useSwitchChain();
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
    const { gasUnits } = useGasUnitsCalculator(amount, selectedChain);

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

    const handleChainSelect = (chainIdStr: string) => {
        setSelectedChain(chainIdStr);
        const chainConfig = SUPPORTED_CHAINS.find(c => c.id === chainIdStr);
        if (chainConfig && switchChain && chainId !== chainConfig.chainId) {
            switchChain({ chainId: chainConfig.chainId });
        }
    };

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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] flex items-center justify-center mb-6 bg-green-500/10 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">Credits Secured!</h1>
                <p className="text-sm sm:text-base text-white/50 mb-6 max-w-xs sm:max-w-md leading-relaxed">
                    Locked at <span className="text-green-400 font-bold">{selectedChainData?.priceGwei} gwei</span> for the next {expiry} days.
                </p>
                {txHash && (
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-8 flex items-center gap-2 group cursor-help transition-colors hover:bg-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Hex</span>
                        <code className="text-xs text-white/60 font-mono">
                            {txHash.slice(0, 6)}...{txHash.slice(-4)}
                        </code>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs sm:max-w-none sm:w-auto">
                    <Button
                        onClick={() => { setSuccess(false); setAmount(""); }}
                        variant="secondary"
                        className="w-full sm:w-auto min-w-[140px]"
                    >
                        Accumulate More
                    </Button>
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto"
                    >
                        <Button variant="primary" className="w-full min-w-[140px] flex items-center justify-center gap-2">
                            Portfolio
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-8 text-center px-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Buy Gas Credits</h1>
                <p className="text-sm sm:text-base text-white/60">
                    Lock in today&apos;s gas prices for future transactions
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Chain Selection */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl">
                    <label className="block text-xs sm:text-sm font-medium text-white/60 mb-3 sm:mb-4 uppercase tracking-wider">
                        Select Chain {pricesLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" />}
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {prices.map((chain) => (
                            <button
                                key={chain.chain}
                                type="button"
                                onClick={() => handleChainSelect(chain.chain)}
                                className={`p-3 sm:p-4 rounded-xl border transition-all text-left ${selectedChain === chain.chain
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20 text-white/70"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{chain.chainName}</span>
                                    {chain.isBuySignal && (
                                        <span className="text-xs px-2 py-0.5 bg-white/10 text-primary rounded-lg">
                                            Good
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold">{parseFloat(chain.priceGwei.toFixed(5))}</span>
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
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
                        <label className="text-xs sm:text-sm font-medium text-white/60 uppercase tracking-wider">
                            USDC Amount
                        </label>
                        {!balanceLoading && (
                            <span className="text-[10px] sm:text-xs">
                                <span className="text-white/40">Bal:</span> <span className="text-white">${parseFloat(usdcBalance).toLocaleString()}</span>
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min={MIN_PURCHASE_AMOUNT}
                            max="10000"
                            className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-lg sm:text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/10"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 font-bold text-sm">
                            USDC
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <div className="flex gap-2">
                            {[10, 25, 50, 100].map((preset) => (
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
                            <p className="text-xs text-amber-500 flex items-center gap-1.5 ml-auto bg-white/10 px-2 py-1 rounded-lg">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Min: ${MIN_PURCHASE_AMOUNT}
                            </p>
                        )}
                        {hasInsufficientBalance && usdcAmount >= MIN_PURCHASE_AMOUNT && (
                            <p className="text-xs text-amber-500 flex items-center gap-1.5 ml-auto bg-white/10 px-2 py-1 rounded-lg">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Insufficient balance
                            </p>
                        )}
                    </div>
                </div>

                {/* Expiry Selection */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl">
                    <div className="flex flex-col mb-3 sm:mb-4 px-1">
                        <label className="text-xs sm:text-sm font-medium text-white/60 uppercase tracking-wider">
                            Lock Duration
                        </label>
                        <p className="text-[10px] text-white/40 mt-1">
                            Refundable (2% fee) if expired.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { days: 7, label: "1 Week" },
                            { days: 14, label: "2 Weeks" },
                            { days: 30, label: "1 Month", popular: true },
                            { days: 60, label: "2 Months" },
                            { days: 90, label: "3 Months" },
                        ].map((opt) => (
                            <button
                                key={opt.days}
                                type="button"
                                onClick={() => setExpiry(opt.days)}
                                className={`p-3 sm:p-4 rounded-xl border transition-all text-left ${expiry === opt.days
                                    ? "border-primary bg-primary/10 text-white"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20 text-white/70"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                    <span className="font-bold text-base sm:text-lg">{opt.days} <span className="text-[10px] text-white/40 ml-1">days</span></span>
                                    {opt.popular && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                                    )}
                                </div>
                                <div className="text-[10px] sm:text-xs text-white/40 font-medium">{opt.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                {usdcAmount >= MIN_PURCHASE_AMOUNT && (
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 rounded-2xl">
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-4 text-white/40 text-center">Order Summary</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:text-sm mb-6 px-1">
                            <div className="flex flex-col gap-1">
                                <span className="text-white/30 uppercase text-[10px] font-bold">Network</span>
                                <span className="font-bold text-white">{selectedChainData?.chainName}</span>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-white/30 uppercase text-[10px] font-bold">Price</span>
                                <span className="font-bold text-green-400">{selectedChainData?.priceGwei} gwei</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-white/30 uppercase text-[10px] font-bold">Units</span>
                                <span className="font-bold text-white">~{gasUnits}</span>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                                <span className="text-white/30 uppercase text-[10px] font-bold">Total Cost</span>
                                <span className="font-bold text-white">${usdcAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed font-medium">
                                Locked at {selectedChainData?.priceGwei} gwei for {expiry} days.
                                Redeem when gas is high to save.
                            </p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={usdcAmount < MIN_PURCHASE_AMOUNT || isPending || hasInsufficientBalance}
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isApproving ? "Approving USDC..." : "Purchasing..."}
                        </span>
                    ) : (
                        <>
                            Buy Gas Credits
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
