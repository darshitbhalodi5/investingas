"use client";

import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { AlertCircle, CheckCircle, ArrowRight, Info, Loader2 } from "lucide-react";
import { usePurchaseCredits, useUSDCBalance } from "@/hooks/useGasFutures";
import { useAllGasPrices, useGasUnitsCalculator } from "@/hooks/useGasPrices";
import { ConnectWalletPrompt } from "@/components/dashboard/ConnectWalletPrompt";
import { SUPPORTED_CHAINS } from "@/lib/contracts";
import { RiGasStationLine } from "react-icons/ri";
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
                    <a href="/dashboard" className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all font-semibold flex items-center gap-2">
                        View Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Buy Gas Credits</h1>
                <p className="text-foreground/60">
                    Lock in today&apos;s gas prices for future transactions
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Chain Selection */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <label className="block text-sm font-medium text-foreground mb-4">
                        Select Chain {pricesLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" />}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {prices.map((chain) => (
                            <button
                                key={chain.chain}
                                type="button"
                                onClick={() => handleChainSelect(chain.chain)}
                                className={`p-4 rounded-xl border transition-all text-left ${selectedChain === chain.chain
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
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-medium text-foreground">
                            USDC Amount
                        </label>
                        {!balanceLoading && (
                            <span className="text-xs">
                                <span className="text-white/60">Balance:</span> <span className="text-foreground">${parseFloat(usdcBalance).toLocaleString()}</span>
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min={MIN_PURCHASE_AMOUNT}
                            max="10000"
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">
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
                <div className="bg-white/3 border border-white/8 backdrop-blur-xl p-6 rounded-2xl">
                    <div className="flex flex-col mb-4">
                        <label className="block text-sm font-medium text-foreground">
                            Lock Duration
                        </label>
                        <p className="text-[10px] text-white/60 mt-1">
                            If credits are not used before they expire, they can be refunded minus a small 2% fee.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                                className={`p-4 rounded-xl border transition-all text-left text-foreground ${expiry === opt.days
                                    ? "border-primary bg-primary/10"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-lg">{opt.days} <span className="text-xs text-white/60 ml-1">days</span></span>
                                    {opt.popular && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-md border border-primary/30">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-white/60">{opt.label}</div>
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
                                <span className="font-medium">
                                    ~{gasUnits} <span className="text-xs text-white/40 ml-1">Units</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-white/70">
                                Your credits will be locked at {selectedChainData?.priceGwei} gwei for {expiry} days.
                                You can redeem them anytime when gas prices are higher to save money.
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
