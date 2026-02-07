/**
 * useGasFutures Hook
 * React hooks for interacting with the contract
 */

'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignTypedData } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { useState, useEffect } from 'react';
import { CONTRACT_ADDRESSES, ERC20_ABI, EIP712_DOMAIN, PURCHASE_TYPE, REDEEM_TYPE } from '@/lib/contracts';
import { api } from '@/lib/api';

// Types
export interface GasCredit {
    id: number;
    tokenId: number;
    owner: string;
    targetChain: string;
    gasUnits: string;          // Formatted (gas units)
    remainingGasUnits: string; // Formatted (gas units)
    lockedPriceGwei: number;
    purchaseTimestamp: number;
    expiryTimestamp: number;
    purchaseDate: Date;
    expiryDate: Date;
    isActive: boolean;
    isExpired: boolean;
    daysUntilExpiry: number;
}

// Format credit for display
function formatCredit(position: any): GasCredit {
    const now = Date.now();
    const expiryTime = position.expiry * 1000;

    return {
        id: position.tokenId,
        tokenId: position.tokenId,
        owner: position.owner,
        targetChain: position.targetChain,
        gasUnits: formatUnits(BigInt(position.gasUnitsAvailable || 0), 0),
        remainingGasUnits: formatUnits(BigInt(position.gasUnitsAvailable || 0), 0),
        lockedPriceGwei: Number(formatUnits(BigInt(position.lockedGasPriceWei), 9)),
        purchaseTimestamp: position.purchaseTimestamp,
        expiryTimestamp: position.expiry,
        purchaseDate: new Date(position.purchaseTimestamp * 1000),
        expiryDate: new Date(expiryTime),
        isActive: !position.isExpired,
        isExpired: position.isExpired,
        daysUntilExpiry: Math.max(0, Math.floor((expiryTime - now) / (1000 * 60 * 60 * 24))),
    };
}

/**
 * Hook to fetch user's gas credits
 */
export function useUserCredits() {
    const { address } = useAccount();
    const [credits, setCredits] = useState<GasCredit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchCredits = async () => {
        if (!address) return;
        setIsLoading(true);
        setError(null);
        try {
            const positions = await api.getUserPositions(address);
            setCredits(positions.map(formatCredit));
        } catch (err) {
            console.error('Failed to fetch credits from relayer:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, [address]);

    return {
        credits,
        isLoading,
        error,
        refetch: fetchCredits,
        totalCredits: credits.length,
        activeCredits: credits.filter(c => !c.isExpired).length,
    };
}

/**
 * Hook to fetch user's savings stats
 * @deprecated Not supported in v2 relayer yet
 */
export function useUserStats() {
    return {
        totalSavings: '0',
        totalPayouts: '0',
    };
}

/**
 * Hook to purchase gas credits
 */
export function usePurchaseCredits() {
    const { address } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Keep approval logic as is
    const { writeContract: approve, data: approveHash } = useWriteContract();
    const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    // Check allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.usdc as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        // Approve spender: Hook contract
        args: address ? [address, CONTRACT_ADDRESSES.gasFuturesHook as `0x${string}`] : undefined,
        query: { enabled: !!address },
    });

    const purchaseCredits = async (
        usdcAmount: string,
        targetChain: string,
        expiryDays: number
    ) => {
        if (!address) throw new Error('Wallet not connected');

        setIsPending(true);
        setIsSuccess(false);
        const amount = parseUnits(usdcAmount, 6);
        const timestamp = Math.floor(Date.now() / 1000);

        try {
            // 1. Check if approval needed
            const currentAllowance = (allowance as bigint) || 0n;
            if (currentAllowance < amount) {
                approve({
                    address: CONTRACT_ADDRESSES.usdc as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [CONTRACT_ADDRESSES.gasFuturesHook as `0x${string}`, amount],
                });
                return { step: 'approving', hash: approveHash };
            }

            // 2. Sign EIP-712 Intent
            const signature = await signTypedDataAsync({
                domain: EIP712_DOMAIN,
                types: PURCHASE_TYPE,
                primaryType: 'Purchase',
                message: {
                    user: address,
                    usdcAmount: amount,
                    targetChain,
                    expiryDays: BigInt(expiryDays),
                    timestamp: BigInt(timestamp),
                },
            });

            // 3. Submit to Relayer
            const result = await api.purchase({
                user: address,
                usdcAmount: usdcAmount,
                targetChain,
                expiryDays,
                userSignature: signature,
                timestamp,
            });

            if (result.success) {
                setIsSuccess(true);
                return { step: 'purchasing', hash: result.txHash as `0x${string}` };
            } else {
                throw new Error('Purchase failed via relayer');
            }

        } catch (error) {
            console.error('Purchase failed:', error);
            throw error;
        } finally {
            setIsPending(false);
        }
    };

    return {
        purchaseCredits,
        isPending: isPending || isApproving,
        isApproving,
        isPurchasing: isPending, // Relayer call is pending
        approveSuccess,
        purchaseSuccess: isSuccess,
        refetchAllowance,
    };
}

/**
 * Hook to redeem gas credits
 */
export function useRedeemCredits() {
    const { address } = useAccount();
    const { signTypedDataAsync } = useSignTypedData();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<any>(null);
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

    const redeemCredits = async (creditId: number, gasUnitsToUse: string) => {
        if (!address) throw new Error('Wallet not connected');

        setIsLoading(true);
        setIsSuccess(false);
        setError(null);
        setHash(undefined);

        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const units = gasUnitsToUse === 'max' ? 0n : parseUnits(gasUnitsToUse, 18);

            let signAmount = units;
            if (gasUnitsToUse === 'max') {
                const pos = await api.getPosition(creditId);
                signAmount = BigInt(pos?.remainingWethAmount || 0);
            }

            // 1. Sign EIP-712 Intent
            const signature = await signTypedDataAsync({
                domain: EIP712_DOMAIN,
                types: REDEEM_TYPE,
                primaryType: 'Redeem',
                message: {
                    user: address,
                    tokenId: BigInt(creditId),
                    wethAmount: signAmount,
                    timestamp: BigInt(timestamp),
                },
            });

            // 2. Submit to Relayer
            const result = await api.redeem({
                user: address,
                tokenId: creditId,
                wethAmount: gasUnitsToUse === 'max' ? 'max' : signAmount.toString(),
                userSignature: signature,
                timestamp,
            });

            if (result.success) {
                setIsSuccess(true);
                setHash(result.txHash as `0x${string}`);
            } else {
                throw new Error('Redeem failed');
            }
        } catch (err) {
            console.error('Redeem error:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        redeemCredits,
        redeemCreditsWithLifi: redeemCredits, // Alias for now
        isLoading,
        isSuccess,
        error,
        hash,
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

// Deprecated hooks stubbed for compatibility
export function useTransferCredits() {
    return {
        transferCredits: (id: number, to: string, amount: string) => { console.log('Transfer not supported yet'); },
        isLoading: false,
        isSuccess: false,
        error: null
    };
}
export function useCalculateSavings() {
    return { savingsUSDC: '0', lockedCost: '0', currentCost: '0', isLoading: false };
}
