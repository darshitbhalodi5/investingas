/**
 * Relayer API Client
 * Interacts with the InvestInGas Relayer v2
 */

// Relayer URL (default to localhost for now)
const RELAYER_URL = process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:3001';

// Types
export interface GasPosition {
    tokenId: number;
    wethAmount: string;          // wei
    remainingWethAmount: string; // wei
    lockedGasPriceWei: string;   // wei
    purchaseTimestamp: number;   // seconds
    expiry: number;              // seconds
    targetChain: string;
    owner: string;
    gasUnitsAvailable: string;   // gas units
    isExpired: boolean;
}

export interface PurchaseResponse {
    success: boolean;
    txHash: string;
    tokenId: string;
    lockedGasPriceGwei: string;
    expiryTimestamp: number;
}

export interface RedeemResponse {
    success: boolean;
    txHash: string;
    wethRedeemed: string;
    targetChain: string;
    bridge: {
        type: 'direct' | 'bridge';
        tool?: string;
        estimatedReceive?: string;
    };
}

export const api = {
    /**
     * Get user's gas positions (NFTs)
     */
    getUserPositions: async (user: string): Promise<GasPosition[]> => {
        try {
            const res = await fetch(`${RELAYER_URL}/api/positions/${user}`);
            if (!res.ok) throw new Error('Failed to fetch positions');
            const data = await res.json();
            return data.positions || [];
        } catch (error) {
            console.error('Error fetching positions:', error);
            return [];
        }
    },

    /**
     * Get specific position details
     */
    getPosition: async (tokenId: number): Promise<GasPosition | null> => {
        try {
            const res = await fetch(`${RELAYER_URL}/api/positions/token/${tokenId}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.position;
        } catch (error) {
            console.error('Error fetching position:', error);
            return null;
        }
    },

    /**
     * Purchase gas position
     */
    purchase: async (params: {
        user: string;
        usdcAmount: string;     // 6 decimals
        targetChain: string;
        expiryDays: number;
        userSignature: string;
        timestamp: number;
    }): Promise<PurchaseResponse> => {
        const res = await fetch(`${RELAYER_URL}/api/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Purchase failed');
        }

        return await res.json();
    },

    /**
     * Redeem gas position
     */
    redeem: async (params: {
        user: string;
        tokenId: number;
        wethAmount: string;     // wei or 'max'
        userSignature: string;
        timestamp: number;
    }): Promise<RedeemResponse> => {
        const res = await fetch(`${RELAYER_URL}/api/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Redeem failed');
        }

        return await res.json();
    },

    /**
     * Get supported chains from LiFi
     */
    getGlobalGasPrices: async () => {
        try {
            const res = await fetch(`${RELAYER_URL}/api/prices`);
            if (!res.ok) throw new Error('Failed to fetch prices');
            return await res.json();
        } catch (error) {
            console.error('Error fetching prices:', error);
            return { gasPrices: [] };
        }
    },
};
