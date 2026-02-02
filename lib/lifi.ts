/**
 * LiFi SDK Integration
 * Cross-chain bridge quote and execution for gas credit redemption
 */

'use client';

import { useState, useCallback } from 'react';

// LiFi Types
export interface LifiQuote {
    transactionRequest: {
        to: string;
        data: `0x${string}`;
        value: string;
        gasLimit: string;
    };
    estimate: {
        fromAmount: string;
        toAmount: string;
        toAmountMin: string;
        executionDuration: number;
        feeCosts: {
            amount: string;
            token: { symbol: string };
        }[];
    };
    action: {
        fromChainId: number;
        toChainId: number;
        fromToken: { symbol: string; address: string };
        toToken: { symbol: string; address: string };
    };
}

export interface LifiQuoteParams {
    fromChainId: number;
    toChainId: number;
    fromToken: string; // USDC address on Arc
    toToken: string; // Native token address (0x...0 for ETH)
    fromAmount: string; // In smallest units
    fromAddress: string;
    toAddress: string;
}

// Chain ID to native token mapping
const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000';

const CHAIN_CONFIGS: Record<number, { name: string; nativeSymbol: string }> = {
    1: { name: 'Ethereum', nativeSymbol: 'ETH' },
    8453: { name: 'Base', nativeSymbol: 'ETH' },
    42161: { name: 'Arbitrum', nativeSymbol: 'ETH' },
    137: { name: 'Polygon', nativeSymbol: 'MATIC' },
    10: { name: 'Optimism', nativeSymbol: 'ETH' },
};

/**
 * Hook to get LiFi quote for cross-chain redemption
 */
export function useLifiQuote() {
    const [quote, setQuote] = useState<LifiQuote | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getQuote = useCallback(async (params: LifiQuoteParams): Promise<LifiQuote | null> => {
        setIsLoading(true);
        setError(null);

        try {
            // Use LiFi API to get quote
            const queryParams = new URLSearchParams({
                fromChain: params.fromChainId.toString(),
                toChain: params.toChainId.toString(),
                fromToken: params.fromToken,
                toToken: params.toToken,
                fromAmount: params.fromAmount,
                fromAddress: params.fromAddress,
                toAddress: params.toAddress,
                slippage: '0.03', // 3% slippage
            });

            const response = await fetch(`https://li.quest/v1/quote?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to get quote');
            }

            const data = await response.json();
            setQuote(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            console.error('LiFi quote error:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearQuote = useCallback(() => {
        setQuote(null);
        setError(null);
    }, []);

    return {
        quote,
        isLoading,
        error,
        getQuote,
        clearQuote,
    };
}

/**
 * Generate mock quote for development
 */
export function getMockLifiQuote(
    fromChainId: number,
    toChainId: number,
    usdcAmount: string
): LifiQuote {
    const toConfig = CHAIN_CONFIGS[toChainId] || CHAIN_CONFIGS[1];
    const amountNumber = parseFloat(usdcAmount);

    // Estimate: ~$3000/ETH, so $30 USDC ≈ 0.01 ETH
    const estimatedNativeAmount = (amountNumber / 3000) * 0.98; // 2% slippage

    return {
        transactionRequest: {
            to: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE', // LiFi Diamond
            data: '0x1234567890abcdef', // Mock calldata
            value: '0',
            gasLimit: '300000',
        },
        estimate: {
            fromAmount: (amountNumber * 1e6).toString(),
            toAmount: (estimatedNativeAmount * 1e18).toString(),
            toAmountMin: ((estimatedNativeAmount * 0.97) * 1e18).toString(),
            executionDuration: 180, // 3 minutes
            feeCosts: [
                { amount: ((amountNumber * 0.003) * 1e6).toString(), token: { symbol: 'USDC' } },
            ],
        },
        action: {
            fromChainId,
            toChainId,
            fromToken: { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
            toToken: { symbol: toConfig.nativeSymbol, address: NATIVE_TOKEN },
        },
    };
}

/**
 * Format LiFi estimate for display
 */
export function formatLifiEstimate(quote: LifiQuote) {
    const toConfig = CHAIN_CONFIGS[quote.action.toChainId] || { nativeSymbol: 'tokens' };
    const toAmount = parseFloat(quote.estimate.toAmount) / 1e18;
    const toAmountMin = parseFloat(quote.estimate.toAmountMin) / 1e18;
    const fees = quote.estimate.feeCosts.reduce((sum, fee) => {
        return sum + parseFloat(fee.amount) / 1e6;
    }, 0);

    return {
        receivedAmount: toAmount.toFixed(6),
        minimumReceived: toAmountMin.toFixed(6),
        symbol: toConfig.nativeSymbol,
        fees: fees.toFixed(2),
        duration: `~${Math.ceil(quote.estimate.executionDuration / 60)} min`,
        chainName: CHAIN_CONFIGS[quote.action.toChainId]?.name || 'Unknown',
    };
}

/**
 * Chain options for cross-chain redemption
 */
export const CROSS_CHAIN_OPTIONS = [
    { chainId: 1, name: 'Ethereum', symbol: 'ETH', icon: '⟠' },
    { chainId: 8453, name: 'Base', symbol: 'ETH', icon: '🔵' },
    { chainId: 42161, name: 'Arbitrum', symbol: 'ETH', icon: '🔷' },
    { chainId: 137, name: 'Polygon', symbol: 'MATIC', icon: '🟣' },
    { chainId: 10, name: 'Optimism', symbol: 'ETH', icon: '🔴' },
];
