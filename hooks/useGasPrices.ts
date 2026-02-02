/**
 * useGasPrices Hook
 * Fetch live gas prices - can use contract data or mock for development
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, ARC_GAS_FUTURES_ABI, SUPPORTED_CHAINS } from '@/lib/contracts';

export interface GasPriceData {
    chain: string;
    chainName: string;
    priceGwei: number;
    volatility24h: number;
    high24h: number;
    low24h: number;
    lastUpdated: Date;
    change24h: number;
    isBuySignal: boolean;
}

// Mock data for development (when contracts aren't deployed)
const MOCK_PRICES: Record<string, GasPriceData> = {
    ethereum: {
        chain: 'ethereum',
        chainName: 'Ethereum',
        priceGwei: 25,
        volatility24h: 8,
        high24h: 45,
        low24h: 18,
        lastUpdated: new Date(),
        change24h: -12,
        isBuySignal: true,
    },
    base: {
        chain: 'base',
        chainName: 'Base',
        priceGwei: 1,
        volatility24h: 0,
        high24h: 2,
        low24h: 1,
        lastUpdated: new Date(),
        change24h: 0,
        isBuySignal: false,
    },
    arbitrum: {
        chain: 'arbitrum',
        chainName: 'Arbitrum',
        priceGwei: 1,
        volatility24h: 0,
        high24h: 1,
        low24h: 0,
        lastUpdated: new Date(),
        change24h: -5,
        isBuySignal: true,
    },
    polygon: {
        chain: 'polygon',
        chainName: 'Polygon',
        priceGwei: 80,
        volatility24h: 15,
        high24h: 120,
        low24h: 50,
        lastUpdated: new Date(),
        change24h: 8,
        isBuySignal: false,
    },
    optimism: {
        chain: 'optimism',
        chainName: 'Optimism',
        priceGwei: 1,
        volatility24h: 0,
        high24h: 1,
        low24h: 0,
        lastUpdated: new Date(),
        change24h: -2,
        isBuySignal: true,
    },
};

/**
 * Hook to get gas price for a specific chain
 */
export function useGasPrice(chain: string) {
    const [price, setPrice] = useState<GasPriceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [useMock, setUseMock] = useState(true);

    // Try to read from contract
    const { data: contractData, isError } = useReadContract({
        address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
        abi: ARC_GAS_FUTURES_ABI,
        functionName: 'getGasPriceData',
        args: [chain],
        query: {
            enabled: !useMock && !!chain,
            retry: false,
        },
    });

    useEffect(() => {
        // If contract call fails or address is zero, use mock
        if (isError || CONTRACT_ADDRESSES.arcGasFutures === '0x0000000000000000000000000000000000000000') {
            setUseMock(true);
        }
    }, [isError]);

    useEffect(() => {
        if (useMock) {
            // Use mock data
            const mockPrice = MOCK_PRICES[chain];
            if (mockPrice) {
                // Add some randomness to make it feel live
                setPrice({
                    ...mockPrice,
                    priceGwei: mockPrice.priceGwei + Math.floor(Math.random() * 5) - 2,
                    lastUpdated: new Date(),
                });
            }
            setIsLoading(false);
        } else if (contractData) {
            // Use real contract data
            const data = contractData as {
                currentPriceGwei: bigint;
                volatility24h: bigint;
                high24h: bigint;
                low24h: bigint;
                lastUpdated: bigint;
            };

            const chainInfo = SUPPORTED_CHAINS.find(c => c.id === chain);
            const avg = (Number(data.high24h) + Number(data.low24h)) / 2;
            const change = avg > 0 ? ((Number(data.currentPriceGwei) - avg) / avg) * 100 : 0;

            setPrice({
                chain,
                chainName: chainInfo?.name || chain,
                priceGwei: Number(data.currentPriceGwei),
                volatility24h: Number(data.volatility24h),
                high24h: Number(data.high24h),
                low24h: Number(data.low24h),
                lastUpdated: new Date(Number(data.lastUpdated) * 1000),
                change24h: Math.round(change),
                isBuySignal: change < -10,
            });
            setIsLoading(false);
        }
    }, [chain, useMock, contractData]);

    return { price, isLoading, useMock };
}

/**
 * Hook to get all gas prices
 */
export function useAllGasPrices() {
    const [prices, setPrices] = useState<GasPriceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPrices = useCallback(() => {
        // For now, use mock data - will upgrade to real data after deployment
        const allPrices = Object.values(MOCK_PRICES).map(p => ({
            ...p,
            priceGwei: Math.max(1, p.priceGwei + Math.floor(Math.random() * 5) - 2),
            lastUpdated: new Date(),
        }));
        setPrices(allPrices);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPrices();

        // Refresh every 5 seconds
        const interval = setInterval(fetchPrices, 5000);
        return () => clearInterval(interval);
    }, [fetchPrices]);

    return {
        prices,
        isLoading,
        refetch: fetchPrices,
        buySignals: prices.filter(p => p.isBuySignal),
    };
}

/**
 * Hook to calculate gas units for a given USDC amount
 */
export function useGasUnitsCalculator(usdcAmount: string, chain: string, ethPriceUSD = 3000) {
    const { price } = useGasPrice(chain);

    if (!price || !usdcAmount || parseFloat(usdcAmount) <= 0) {
        return { gasUnits: '0', estimatedTxs: 0 };
    }

    const usdcValue = parseFloat(usdcAmount);
    // gasUnits = (usdcPaid * 10^15 * 10^6) / (priceGwei * ethPriceUSD)
    const gasUnits = (usdcValue * 1e15 * 1e6) / (price.priceGwei * ethPriceUSD);

    // Estimate transactions (assuming 21000 gas per simple tx)
    const estimatedTxs = Math.floor(gasUnits / 21000);

    return {
        gasUnits: gasUnits.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        estimatedTxs,
    };
}
