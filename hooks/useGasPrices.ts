/**
 * useGasPrices Hook
 * Fetch live gas prices
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_CHAINS } from '@/lib/contracts';
import { api } from '@/lib/api';

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

// Mock data for development (fallback)
const MOCK_PRICES: Record<string, GasPriceData> = {
    ethereum: { chain: 'ethereum', chainName: 'Sepolia', priceGwei: 2, volatility24h: 8, high24h: 5, low24h: 1, lastUpdated: new Date(), change24h: -12, isBuySignal: true },
    base: { chain: 'base', chainName: 'Base Sepolia', priceGwei: 0.1, volatility24h: 0, high24h: 0.2, low24h: 0.1, lastUpdated: new Date(), change24h: 0, isBuySignal: false },
    arbitrum: { chain: 'arbitrum', chainName: 'Arbitrum Sepolia', priceGwei: 0.1, volatility24h: 0, high24h: 0.5, low24h: 0.1, lastUpdated: new Date(), change24h: -5, isBuySignal: true },
    optimism: { chain: 'optimism', chainName: 'Optimism Sepolia', priceGwei: 0.1, volatility24h: 0, high24h: 0.5, low24h: 0.1, lastUpdated: new Date(), change24h: -2, isBuySignal: true },
    polygon: { chain: 'polygon', chainName: 'Polygon Amoy', priceGwei: 15, volatility24h: 15, high24h: 30, low24h: 5, lastUpdated: new Date(), change24h: 8, isBuySignal: false },
};

/**
 * Hook to get all gas prices from Relayer
 */
export function useAllGasPrices() {
    const [prices, setPrices] = useState<GasPriceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPrices = useCallback(async () => {
        try {
            const data = await api.getGlobalGasPrices();
            if (data && data.gasPrices && data.gasPrices.length > 0) {
                const mappedPrices = data.gasPrices.map((p: any) => ({
                    chain: p.chain,
                    chainName: SUPPORTED_CHAINS.find(c => c.id === p.chain)?.name || p.chain,
                    priceGwei: p.price, // API returns Gwei
                    volatility24h: 0,
                    high24h: p.price * 1.2,
                    low24h: p.price * 0.8,
                    lastUpdated: new Date(p.timestamp),
                    change24h: 0,
                    isBuySignal: false,
                }));
                setPrices(mappedPrices);
            } else {
                useMockData();
            }
        } catch (err) {
            console.warn('Failed to fetch prices from API, using mock data');
            useMockData();
        } finally {
            setIsLoading(false);
        }
    }, []);

    const useMockData = () => {
        const allPrices = Object.values(MOCK_PRICES).map(p => ({
            ...p,
            priceGwei: Math.max(1, p.priceGwei + Math.floor(Math.random() * 5) - 2),
            lastUpdated: new Date(),
        }));
        setPrices(allPrices);
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 270000); // 4.5min refresh
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
 * Hook to get gas price for a specific chain
 */
export function useGasPrice(chain: string) {
    const { prices, isLoading } = useAllGasPrices();
    const price = prices.find(p => p.chain === chain) || null;
    return { price, isLoading, useMock: false };
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
