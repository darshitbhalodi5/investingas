/**
 * LiFi SDK Integration
 * Cross-chain bridge quote and execution for gas credit redemption
 */

'use client';

import { useState, useCallback } from 'react';
import { SiEthereum, SiOptimism, SiPolygon } from 'react-icons/si';

// Custom icons for chains
const BaseIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 1280 1280" className={`w-8 h-8 ${className}`}>
        <path fill="currentColor" d="M0,101.12c0-34.64,0-51.95,6.53-65.28,6.25-12.76,16.56-23.07,29.32-29.32C49.17,0,66.48,0,101.12,0h1077.76c34.63,0,51.96,0,65.28,6.53,12.75,6.25,23.06,16.56,29.32,29.32,6.52,13.32,6.52,30.64,6.52,65.28v1077.76c0,34.63,0,51.96-6.52,65.28-6.26,12.75-16.57,23.06-29.32,29.32-13.32,6.52-30.65,6.52-65.28,6.52H101.12c-34.64,0-51.95,0-65.28-6.52-12.76-6.26-23.07-16.57-29.32-29.32-6.53-13.32-6.53-30.65-6.53-65.28V101.12Z" />
    </svg>
);

const ArbitrumIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 741.07 788.07" className={`w-8 h-8 ${className}`}>
        <g>
            <path fill="#05163d" d="M199.08,311.99v163.76c0,10.39,5.54,20.09,14.64,25.23l141.7,81.83c9.01,5.24,20.19,5.24,29.19,0l141.79-81.83c9.01-5.24,14.64-14.84,14.64-25.23v-163.76c0-10.39-5.54-20.09-14.64-25.33l-141.79-81.83c-9-5.24-20.18-5.24-29.19,0l-141.79,81.83c-8.91,5.24-14.55,14.84-14.55,25.33Z" />
            <path fill="#12aaff" d="M401.04,425.58l-20.29,55.41c-.59,1.48-.59,3.26,0,4.75l34.73,95.39,40.27-23.25-48.29-132.39c-1.09-2.97-5.34-2.97-6.43.1Z" />
            <path fill="#12aaff" d="M441.51,332.27c-1.09-3.07-5.34-3.07-6.53,0l-20.28,55.41c-.59,1.58-.59,3.26,0,4.75l57,156.24,40.27-23.25-70.45-193.15Z" />
            <path fill="#9dcced" d="M370.07,210.86c.99,0,1.98.3,2.87.79l153.37,88.56c1.78.99,2.87,2.87,2.87,4.95v177.12c0,2.08-1.09,3.96-2.87,4.95l-153.37,88.66c-.89.49-1.88.79-2.87.79s-1.98-.3-2.87-.79l-153.37-88.56c-1.78-.99-2.87-2.87-2.87-4.95v-177.22c0-2.08,1.09-3.96,2.87-4.95l153.37-88.56c.89-.49,1.88-.79,2.87-.79ZM370.07,185.04c-5.44,0-10.98,1.48-15.83,4.25l-153.37,88.56c-9.7,5.64-15.83,16.03-15.83,27.31v177.12c0,11.28,6.04,21.77,15.83,27.41l153.37,88.56c4.85,2.87,10.29,4.25,15.83,4.25s10.98-1.48,15.83-4.25l153.37-88.56c9.8-5.64,15.83-16.03,15.83-27.41v-177.12c0-11.28-6.04-21.77-15.83-27.41l-153.37-88.46c-4.95-2.77-10.39-4.25-15.83-4.25Z" />
            <path fill="#05163d" d="M268.64,548.87l14.15-38.59,28.3,23.55-26.42,24.24-16.03-9.2Z" />
            <path fill="#fff" d="M357.11,292.59h-38.89c-2.87,0-5.54,1.78-6.53,4.55l-83.32,228.57,40.27,23.25,91.83-251.73c.79-2.28-.89-4.65-3.37-4.65Z" />
            <path fill="#fff" d="M425.18,292.59h-38.89c-2.87,0-5.54,1.78-6.53,4.55l-95.09,260.93,40.27,23.25,103.5-284.08c.89-2.28-.89-4.65-3.27-4.65Z" />
        </g>
    </svg>
);

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
    11155111: { name: 'Ethereum', nativeSymbol: 'ETH' },
    84532: { name: 'Base Sepolia', nativeSymbol: 'ETH' },
    421614: { name: 'Arbitrum Sepolia', nativeSymbol: 'ETH' },
    11155420: { name: 'Optimism Sepolia', nativeSymbol: 'ETH' },
    80002: { name: 'Polygon Amoy', nativeSymbol: 'MATIC' },
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
    const toConfig = CHAIN_CONFIGS[toChainId] || CHAIN_CONFIGS[11155111];
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
    { chainId: 11155111, name: 'Ethereum', symbol: 'ETH', icon: <SiEthereum className="text-[#627EAA]" /> },
    { chainId: 84532, name: 'Base', symbol: 'ETH', icon: <BaseIcon className="text-[#0052FF]" /> },
    { chainId: 421614, name: 'Arbitrum', symbol: 'ETH', icon: <ArbitrumIcon /> },
    { chainId: 11155420, name: 'Optimism', symbol: 'ETH', icon: <SiOptimism className="text-[#FF0420]" /> },
    { chainId: 80002, name: 'Polygon Amoy', symbol: 'MATIC', icon: <SiPolygon className="text-[#8247E5]" /> },
];
