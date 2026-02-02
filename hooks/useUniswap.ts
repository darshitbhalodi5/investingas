/**
 * Uniswap V4 Trading Hooks
 * Hooks for trading gas credits on Uniswap V4 pools
 */

'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

// Pool Manager ABI (key functions for swapping)
const POOL_MANAGER_ABI = [
    {
        name: 'swap',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            {
                name: 'key', type: 'tuple', components: [
                    { name: 'currency0', type: 'address' },
                    { name: 'currency1', type: 'address' },
                    { name: 'fee', type: 'uint24' },
                    { name: 'tickSpacing', type: 'int24' },
                    { name: 'hooks', type: 'address' },
                ]
            },
            {
                name: 'params', type: 'tuple', components: [
                    { name: 'zeroForOne', type: 'bool' },
                    { name: 'amountSpecified', type: 'int256' },
                    { name: 'sqrtPriceLimitX96', type: 'uint160' },
                ]
            },
            { name: 'hookData', type: 'bytes' },
        ],
        outputs: [{ name: 'delta', type: 'int256' }],
    },
] as const;

// Mock pool addresses (update after deployment)
export const POOL_CONFIG = {
    poolManager: process.env.NEXT_PUBLIC_POOL_MANAGER || '0x0000000000000000000000000000000000000000',
    gasFuturesHook: process.env.NEXT_PUBLIC_GAS_FUTURES_HOOK || '0x0000000000000000000000000000000000000000',
};

// Supported trading pairs
export const TRADING_PAIRS = [
    { id: 'eth-gas', name: 'ETH Gas Credits', symbol: 'gETH', chain: 'ethereum', color: '#627eea' },
    { id: 'base-gas', name: 'Base Gas Credits', symbol: 'gBASE', chain: 'base', color: '#0052ff' },
    { id: 'arb-gas', name: 'Arbitrum Gas Credits', symbol: 'gARB', chain: 'arbitrum', color: '#28a0f0' },
    { id: 'poly-gas', name: 'Polygon Gas Credits', symbol: 'gPOLY', chain: 'polygon', color: '#8247e5' },
    { id: 'op-gas', name: 'Optimism Gas Credits', symbol: 'gOP', chain: 'optimism', color: '#ff0420' },
];

// Price data interface
export interface SwapQuote {
    inputAmount: string;
    outputAmount: string;
    priceImpact: number;
    fee: number;
    route: string;
    executionPrice: string;
}

// Mock order book data
export interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

export interface OrderBook {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    spread: number;
    spreadPercent: number;
}

/**
 * Get mock swap quote
 */
export function getSwapQuote(
    inputToken: string,
    outputToken: string,
    inputAmount: string,
    isBuying: boolean
): SwapQuote {
    const amount = parseFloat(inputAmount) || 0;

    // Mock pricing: 1 USDC = 100 gas units at base rate
    const baseRate = 100;
    const volatilityFee = 0.003; // 0.3% base fee
    const priceImpact = Math.min(amount * 0.0001, 0.05); // Max 5% impact

    const feeMultiplier = 1 - volatilityFee - priceImpact;

    if (isBuying) {
        // USDC -> Gas Credits
        const outputAmount = (amount * baseRate * feeMultiplier).toFixed(0);
        return {
            inputAmount: amount.toFixed(2),
            outputAmount,
            priceImpact: priceImpact * 100,
            fee: volatilityFee * 100,
            route: 'USDC → Uniswap V4 → Gas Credits',
            executionPrice: (parseFloat(outputAmount) / amount).toFixed(2),
        };
    } else {
        // Gas Credits -> USDC
        const outputAmount = ((amount / baseRate) * feeMultiplier).toFixed(2);
        return {
            inputAmount: amount.toFixed(0),
            outputAmount,
            priceImpact: priceImpact * 100,
            fee: volatilityFee * 100,
            route: 'Gas Credits → Uniswap V4 → USDC',
            executionPrice: (amount / parseFloat(outputAmount)).toFixed(2),
        };
    }
}

/**
 * Get mock order book
 */
export function getOrderBook(pair: string): OrderBook {
    const basePrice = 0.01; // 1 gas unit = $0.01 USDC

    // Generate mock bids (buy orders)
    const bids: OrderBookEntry[] = [];
    let bidTotal = 0;
    for (let i = 0; i < 10; i++) {
        const price = basePrice * (1 - (i * 0.005));
        const amount = Math.floor(Math.random() * 100000) + 10000;
        bidTotal += amount;
        bids.push({ price, amount, total: bidTotal });
    }

    // Generate mock asks (sell orders)
    const asks: OrderBookEntry[] = [];
    let askTotal = 0;
    for (let i = 0; i < 10; i++) {
        const price = basePrice * (1 + ((i + 1) * 0.005));
        const amount = Math.floor(Math.random() * 100000) + 10000;
        askTotal += amount;
        asks.push({ price, amount, total: askTotal });
    }

    const spread = asks[0].price - bids[0].price;
    const spreadPercent = (spread / basePrice) * 100;

    return { bids, asks, spread, spreadPercent };
}

/**
 * Hook to execute swap on Uniswap V4
 */
export function useSwap() {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { writeContract, data: hash } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const executeSwap = useCallback(async (
        inputToken: string,
        outputToken: string,
        inputAmount: string,
        slippage: number = 0.5
    ) => {
        if (!address) {
            setError('Wallet not connected');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            // In production, this would call the actual PoolManager
            // For now, simulate a successful swap
            console.log('Executing swap:', { inputToken, outputToken, inputAmount, slippage });

            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            return { success: true, hash: '0x...' };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Swap failed';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    return {
        executeSwap,
        isLoading: isLoading || isConfirming,
        isSuccess,
        error,
        hash,
    };
}

/**
 * Hook to get recent trades
 */
export function useRecentTrades(pair: string) {
    const [trades] = useState(() => {
        // Generate mock recent trades
        const mockTrades = [];
        const now = Date.now();

        for (let i = 0; i < 20; i++) {
            mockTrades.push({
                id: i,
                price: 0.01 + (Math.random() - 0.5) * 0.002,
                amount: Math.floor(Math.random() * 50000) + 1000,
                side: Math.random() > 0.5 ? 'buy' : 'sell',
                time: new Date(now - i * 30000), // 30 seconds apart
            });
        }

        return mockTrades;
    });

    return { trades };
}

/**
 * Hook for price chart data
 */
export function usePriceChart(pair: string, timeframe: string) {
    const [chartData] = useState(() => {
        // Generate mock OHLC data
        const data = [];
        const now = Date.now();
        let lastClose = 0.01;

        const intervals = timeframe === '1H' ? 60 : timeframe === '1D' ? 24 : 7;
        const intervalMs = timeframe === '1H' ? 60000 : timeframe === '1D' ? 3600000 : 86400000;

        for (let i = intervals; i >= 0; i--) {
            const volatility = 0.002;
            const open = lastClose;
            const change = (Math.random() - 0.5) * volatility;
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
            const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);

            data.push({
                time: new Date(now - i * intervalMs),
                open,
                high,
                low,
                close,
                volume: Math.floor(Math.random() * 1000000) + 100000,
            });

            lastClose = close;
        }

        return data;
    });

    return { chartData };
}
