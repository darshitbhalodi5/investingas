/**
 * useGasFutures Hook
 * React hooks for interacting with the ArcGasFutures contract
 */

'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { useState, useEffect } from 'react';
import { CONTRACT_ADDRESSES, ARC_GAS_FUTURES_ABI, ERC20_ABI } from '@/lib/contracts';

// Types
export interface GasCredit {
    id: bigint;
    owner: string;
    targetChain: string;
    gasUnits: bigint;
    remainingGasUnits: bigint;
    lockedPriceGwei: bigint;
    usdcPaid: bigint;
    purchaseTime: bigint;
    expiryTime: bigint;
    isActive: boolean;
}

export interface FormattedGasCredit {
    id: number;
    targetChain: string;
    gasUnits: string;
    remainingGasUnits: string;
    lockedPriceGwei: number;
    usdcPaid: string;
    purchaseDate: Date;
    expiryDate: Date;
    isActive: boolean;
    isExpired: boolean;
    daysUntilExpiry: number;
}

// Format credit for display
function formatCredit(credit: GasCredit): FormattedGasCredit {
    const now = Date.now();
    const expiryTime = Number(credit.expiryTime) * 1000;

    return {
        id: Number(credit.id),
        targetChain: credit.targetChain,
        gasUnits: formatUnits(credit.gasUnits, 18),
        remainingGasUnits: formatUnits(credit.remainingGasUnits, 18),
        lockedPriceGwei: Number(credit.lockedPriceGwei),
        usdcPaid: formatUnits(credit.usdcPaid, 6),
        purchaseDate: new Date(Number(credit.purchaseTime) * 1000),
        expiryDate: new Date(expiryTime),
        isActive: credit.isActive,
        isExpired: now > expiryTime,
        daysUntilExpiry: Math.max(0, Math.floor((expiryTime - now) / (1000 * 60 * 60 * 24))),
    };
}

/**
 * Hook to fetch user's gas credits
 */
export function useUserCredits() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
        abi: ARC_GAS_FUTURES_ABI,
        functionName: 'getUserCredits',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const credits: FormattedGasCredit[] = data
        ? (data as GasCredit[]).map(formatCredit).filter(c => c.isActive)
        : [];

    return {
        credits,
        isLoading,
        error,
        refetch,
        totalCredits: credits.length,
        activeCredits: credits.filter(c => !c.isExpired).length,
    };
}

/**
 * Hook to fetch user's savings stats
 */
export function useUserStats() {
    const { address } = useAccount();

    const { data: savings } = useReadContract({
        address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
        abi: ARC_GAS_FUTURES_ABI,
        functionName: 'userSavings',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const { data: payouts } = useReadContract({
        address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
        abi: ARC_GAS_FUTURES_ABI,
        functionName: 'userPayouts',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    return {
        totalSavings: savings ? formatUnits(savings as bigint, 6) : '0',
        totalPayouts: payouts ? formatUnits(payouts as bigint, 6) : '0',
    };
}

/**
 * Hook to purchase gas credits
 */
export function usePurchaseCredits() {
    const { address } = useAccount();
    const [isPending, setIsPending] = useState(false);

    const { writeContract: approve, data: approveHash } = useWriteContract();
    const { writeContract: purchase, data: purchaseHash } = useWriteContract();

    const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    const { isLoading: isPurchasing, isSuccess: purchaseSuccess } = useWaitForTransactionReceipt({
        hash: purchaseHash,
    });

    // Check allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.usdc as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`] : undefined,
        query: { enabled: !!address },
    });

    const purchaseCredits = async (
        usdcAmount: string,
        targetChain: string,
        expiryDays: number
    ) => {
        if (!address) throw new Error('Wallet not connected');

        setIsPending(true);
        const amount = parseUnits(usdcAmount, 6);

        try {
            // Check if approval needed
            const currentAllowance = (allowance as bigint) || 0n;
            if (currentAllowance < amount) {
                approve({
                    address: CONTRACT_ADDRESSES.usdc as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`, amount],
                });

                // Wait for approval to be confirmed before purchasing
                return { step: 'approving', hash: approveHash };
            }

            // Execute purchase
            purchase({
                address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
                abi: ARC_GAS_FUTURES_ABI,
                functionName: 'purchaseCredits',
                args: [amount, targetChain, BigInt(expiryDays)],
            });

            return { step: 'purchasing', hash: purchaseHash };
        } finally {
            setIsPending(false);
        }
    };

    return {
        purchaseCredits,
        isPending: isPending || isApproving || isPurchasing,
        isApproving,
        isPurchasing,
        approveSuccess,
        purchaseSuccess,
        refetchAllowance,
    };
}

/**
 * Hook to redeem gas credits (cash settlement)
 */
export function useRedeemCredits() {
    const { writeContract, data: hash } = useWriteContract();

    const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({
        hash,
    });

    const redeemCredits = (creditId: number, gasUnitsToUse: string) => {
        const units = parseUnits(gasUnitsToUse, 18);

        writeContract({
            address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
            abi: ARC_GAS_FUTURES_ABI,
            functionName: 'redeemCredits',
            args: [BigInt(creditId), units],
        });
    };

    const redeemCreditsWithLifi = (
        creditId: number,
        gasUnitsToUse: string,
        lifiData: `0x${string}`
    ) => {
        const units = parseUnits(gasUnitsToUse, 18);

        writeContract({
            address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
            abi: ARC_GAS_FUTURES_ABI,
            functionName: 'redeemCredits',
            args: [
                BigInt(creditId),
                units,
                { cashSettlement: false, lifiData },
            ],
        });
    };

    return {
        redeemCredits,
        redeemCreditsWithLifi,
        isLoading,
        isSuccess,
        error,
        hash,
    };
}

/**
 * Hook to transfer credits
 */
export function useTransferCredits() {
    const { writeContract, data: hash } = useWriteContract();

    const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({
        hash,
    });

    const transferCredits = (
        creditId: number,
        toAddress: string,
        gasUnitsToTransfer: string
    ) => {
        const units = parseUnits(gasUnitsToTransfer, 18);

        writeContract({
            address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
            abi: ARC_GAS_FUTURES_ABI,
            functionName: 'transferCreditsPartial',
            args: [BigInt(creditId), toAddress as `0x${string}`, units],
        });
    };

    return {
        transferCredits,
        isLoading,
        isSuccess,
        error,
        hash,
    };
}

/**
 * Hook to calculate potential savings
 */
export function useCalculateSavings(creditId: number, gasUnits: string) {
    const { address } = useAccount();
    const units = gasUnits ? parseUnits(gasUnits, 18) : 0n;

    const { data, isLoading } = useReadContract({
        address: CONTRACT_ADDRESSES.arcGasFutures as `0x${string}`,
        abi: ARC_GAS_FUTURES_ABI,
        functionName: 'calculateSavings',
        args: address && units > 0n ? [BigInt(creditId), address, units] : undefined,
        query: {
            enabled: !!address && units > 0n,
        },
    });

    if (!data) {
        return { savingsUSDC: '0', lockedCost: '0', currentCost: '0', isLoading };
    }

    const [savings, locked, current] = data as [bigint, bigint, bigint];

    return {
        savingsUSDC: formatUnits(savings, 6),
        lockedCost: formatUnits(locked, 6),
        currentCost: formatUnits(current, 6),
        isLoading,
    };
}

/**
 * Hook to get USDC balance
 */
export function useUSDCBalance() {
    const { address } = useAccount();

    const { data, isLoading, refetch } = useReadContract({
        address: CONTRACT_ADDRESSES.usdc as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    return {
        balance: data ? formatUnits(data as bigint, 6) : '0',
        balanceRaw: data as bigint | undefined,
        isLoading,
        refetch,
    };
}
