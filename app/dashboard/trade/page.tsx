"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
    ArrowDownUp,
    TrendingUp,
    TrendingDown,
    Info,
    Settings,
    RefreshCw,
    ArrowRight,
    Loader2,
    CheckCircle,
    ChevronDown
} from "lucide-react";
import {
    TRADING_PAIRS,
    getSwapQuote,
    getOrderBook,
    useSwap,
    useRecentTrades,
    SwapQuote,
    OrderBook
} from "@/hooks/useUniswap";
import { useUSDCBalance } from "@/hooks/useGasFutures";

export default function TradePage() {
    const { isConnected } = useAccount();
    const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0]);
    const [isBuying, setIsBuying] = useState(true);
    const [inputAmount, setInputAmount] = useState("");
    const [slippage, setSlippage] = useState(0.5);
    const [showSettings, setShowSettings] = useState(false);
    const [quote, setQuote] = useState<SwapQuote | null>(null);
    const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
    const [showPairSelector, setShowPairSelector] = useState(false);
    const [swapSuccess, setSwapSuccess] = useState(false);

    // Hooks
    const { executeSwap, isLoading: isSwapping } = useSwap();
    const { trades } = useRecentTrades(selectedPair.id);
    const { balance: usdcBalance } = useUSDCBalance();

    // Update quote when input changes
    useEffect(() => {
        if (inputAmount && parseFloat(inputAmount) > 0) {
            const newQuote = getSwapQuote(
                isBuying ? 'USDC' : selectedPair.symbol,
                isBuying ? selectedPair.symbol : 'USDC',
                inputAmount,
                isBuying
            );
            setQuote(newQuote);
        } else {
            setQuote(null);
        }
    }, [inputAmount, isBuying, selectedPair]);

    // Update order book
    useEffect(() => {
        const book = getOrderBook(selectedPair.id);
        setOrderBook(book);

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            setOrderBook(getOrderBook(selectedPair.id));
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedPair]);

    const handleSwap = async () => {
        if (!quote) return;

        const result = await executeSwap(
            isBuying ? 'USDC' : selectedPair.symbol,
            isBuying ? selectedPair.symbol : 'USDC',
            inputAmount,
            slippage
        );

        if (result?.success) {
            setSwapSuccess(true);
            setTimeout(() => {
                setSwapSuccess(false);
                setInputAmount("");
            }, 3000);
        }
    };

    const flipDirection = () => {
        setIsBuying(!isBuying);
        setInputAmount("");
        setQuote(null);
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                    <ArrowDownUp className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Connect to Trade</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Trade gas credits on the Uniswap V4 secondary market with dynamic fees.
                </p>
                <ConnectButton />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Trade Gas Credits</h1>
                    <p className="text-white/60">
                        Secondary market trading powered by Uniswap V4
                    </p>
                </div>

                {/* Pair Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowPairSelector(!showPairSelector)}
                        className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all"
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: selectedPair.color }}
                        >
                            {selectedPair.chain.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">{selectedPair.symbol}/USDC</p>
                            <p className="text-xs text-white/40">{selectedPair.name}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/40" />
                    </button>

                    {showPairSelector && (
                        <div className="absolute top-full mt-2 right-0 w-64 bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                            {TRADING_PAIRS.map((pair) => (
                                <button
                                    key={pair.id}
                                    onClick={() => {
                                        setSelectedPair(pair);
                                        setShowPairSelector(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-all ${selectedPair.id === pair.id ? 'bg-white/[0.05]' : ''
                                        }`}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                        style={{ backgroundColor: pair.color }}
                                    >
                                        {pair.chain.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">{pair.symbol}/USDC</p>
                                        <p className="text-xs text-white/40">{pair.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Swap Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                        {/* Swap Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Swap</h2>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <Settings className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Slippage Settings */}
                        {showSettings && (
                            <div className="mb-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                <p className="text-sm text-white/60 mb-3">Slippage Tolerance</p>
                                <div className="flex gap-2">
                                    {[0.1, 0.5, 1.0].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setSlippage(val)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${slippage === val
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {val}%
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        value={slippage}
                                        onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                                        className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-center"
                                        step="0.1"
                                        min="0.1"
                                        max="5"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Input Token */}
                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <div className="flex justify-between text-sm text-white/40 mb-2">
                                <span>{isBuying ? 'You pay' : 'You sell'}</span>
                                <span>
                                    Balance: {isBuying ? parseFloat(usdcBalance).toLocaleString() : '0'}
                                    {isBuying ? ' USDC' : ` ${selectedPair.symbol}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="flex-1 bg-transparent text-2xl font-semibold outline-none placeholder:text-white/20"
                                />
                                <div className="px-4 py-2 bg-white/10 rounded-lg font-semibold">
                                    {isBuying ? 'USDC' : selectedPair.symbol}
                                </div>
                            </div>
                            {isBuying && (
                                <div className="flex gap-2 mt-3">
                                    {[25, 50, 75, 100].map((pct) => (
                                        <button
                                            key={pct}
                                            onClick={() => setInputAmount((parseFloat(usdcBalance) * pct / 100).toFixed(2))}
                                            className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-md transition-all"
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Flip Button */}
                        <div className="flex justify-center -my-3 relative z-10">
                            <button
                                onClick={flipDirection}
                                className="p-3 bg-[#1a1a24] border border-white/10 rounded-xl hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all"
                            >
                                <ArrowDownUp className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Output Token */}
                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <div className="flex justify-between text-sm text-white/40 mb-2">
                                <span>{isBuying ? 'You receive' : 'You receive'}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 text-2xl font-semibold text-white/80">
                                    {quote ? quote.outputAmount : '0.00'}
                                </div>
                                <div className="px-4 py-2 bg-white/10 rounded-lg font-semibold flex items-center gap-2">
                                    <div
                                        className="w-5 h-5 rounded-full"
                                        style={{ backgroundColor: isBuying ? selectedPair.color : undefined }}
                                    />
                                    {isBuying ? selectedPair.symbol : 'USDC'}
                                </div>
                            </div>
                        </div>

                        {/* Quote Details */}
                        {quote && (
                            <div className="mt-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/40">Rate</span>
                                    <span>1 {isBuying ? 'USDC' : selectedPair.symbol} = {quote.executionPrice} {isBuying ? selectedPair.symbol : 'USDC'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40">Price Impact</span>
                                    <span className={quote.priceImpact > 1 ? 'text-amber-500' : 'text-green-400'}>
                                        {quote.priceImpact.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40">Dynamic Fee</span>
                                    <span>{quote.fee.toFixed(2)}%</span>
                                </div>
                                <div className="flex justify-between text-white/40">
                                    <span>Route</span>
                                    <span className="text-xs">{quote.route}</span>
                                </div>
                            </div>
                        )}

                        {/* Swap Button */}
                        <button
                            onClick={handleSwap}
                            disabled={!quote || isSwapping}
                            className="w-full mt-6 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                        >
                            {isSwapping ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Swapping...
                                </>
                            ) : swapSuccess ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Swap Complete!
                                </>
                            ) : (
                                <>
                                    Swap
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Info Banner */}
                        <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-white/70">
                                Trading uses the GasFuturesHook with dynamic fees that increase during high volatility periods.
                            </p>
                        </div>
                    </div>

                    {/* Recent Trades */}
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Recent Trades</h3>
                            <RefreshCw className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {trades.slice(0, 10).map((trade) => (
                                <div key={trade.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        {trade.side === 'buy' ? (
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-400" />
                                        )}
                                        <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                            {trade.side.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-white/60">{trade.amount.toLocaleString()}</span>
                                    <span className="font-medium">${trade.price.toFixed(4)}</span>
                                    <span className="text-white/40 text-xs">
                                        {trade.time.toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Book */}
                <div className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                        <h3 className="font-semibold mb-4">Order Book</h3>

                        {orderBook && (
                            <>
                                {/* Spread */}
                                <div className="text-center py-2 mb-4 bg-white/[0.02] rounded-lg">
                                    <p className="text-xs text-white/40">Spread</p>
                                    <p className="font-semibold">${orderBook.spread.toFixed(5)} ({orderBook.spreadPercent.toFixed(2)}%)</p>
                                </div>

                                {/* Asks (Sell Orders) */}
                                <div className="space-y-1 mb-4">
                                    <p className="text-xs text-white/40 mb-2">Asks</p>
                                    {orderBook.asks.slice(0, 5).reverse().map((ask, i) => (
                                        <div key={i} className="relative flex justify-between text-sm py-1 px-2 rounded">
                                            <div
                                                className="absolute inset-0 bg-red-500/10 rounded"
                                                style={{ width: `${Math.min((ask.amount / 100000) * 100, 100)}%` }}
                                            />
                                            <span className="relative text-red-400">${ask.price.toFixed(4)}</span>
                                            <span className="relative text-white/60">{ask.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Bids (Buy Orders) */}
                                <div className="space-y-1">
                                    <p className="text-xs text-white/40 mb-2">Bids</p>
                                    {orderBook.bids.slice(0, 5).map((bid, i) => (
                                        <div key={i} className="relative flex justify-between text-sm py-1 px-2 rounded">
                                            <div
                                                className="absolute inset-0 bg-green-500/10 rounded"
                                                style={{ width: `${Math.min((bid.amount / 100000) * 100, 100)}%` }}
                                            />
                                            <span className="relative text-green-400">${bid.price.toFixed(4)}</span>
                                            <span className="relative text-white/60">{bid.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Market Stats */}
                    <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 rounded-2xl">
                        <h3 className="font-semibold mb-4">Market Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/40">24h Volume</span>
                                <span className="font-medium">$1.2M</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">24h High</span>
                                <span className="font-medium text-green-400">$0.0112</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">24h Low</span>
                                <span className="font-medium text-red-400">$0.0095</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Liquidity</span>
                                <span className="font-medium">$5.4M</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Current Fee</span>
                                <span className="font-medium">0.3%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
