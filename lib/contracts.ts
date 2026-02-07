/**
 * Contract Configuration
 * ABIs and addresses for all InvestingAs contracts
 */

// Contract Addresses
export const CONTRACT_ADDRESSES = {
    gasFuturesHook: process.env.NEXT_PUBLIC_GAS_FUTURES_HOOK!,
    usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS!,
    lifiDiamond: process.env.NEXT_PUBLIC_LIFI_DIAMOND!,
} as const;

// Chain Configuration
export const CHAIN_CONFIG = {
} as const;

import InvestInGasHook from '../artifacts/InvestInGasHook.json';

// Supported chains for gas credits
export const SUPPORTED_CHAINS = [
    { id: 'sepolia', name: 'Sepolia', symbol: 'ETH', chainId: 11155111 },
    { id: 'base', name: 'Base Sepolia', symbol: 'ETH', chainId: 84532 },
    { id: 'arbitrum', name: 'Arbitrum Sepolia', symbol: 'ETH', chainId: 421614 },
    { id: 'optimism', name: 'Optimism Sepolia', symbol: 'ETH', chainId: 11155420 },
    { id: 'polygon', name: 'Polygon Amoy', symbol: 'MATIC', chainId: 80002 },
] as const;

// InvestInGasHook ABI (Uniswap v4)
export const INVEST_IN_GAS_HOOK_ABI = InvestInGasHook.abi;

// EIP-712 Types
export const EIP712_DOMAIN = {
    name: 'InvestInGas',
    version: '1',
    chainId: 11155111, // Sepolia
    verifyingContract: CONTRACT_ADDRESSES.gasFuturesHook as `0x${string}`,
} as const;

export const PURCHASE_TYPE = {
    Purchase: [
        { name: 'user', type: 'address' },
        { name: 'usdcAmount', type: 'uint256' },
        { name: 'targetChain', type: 'string' },
        { name: 'expiryDays', type: 'uint256' },
        { name: 'timestamp', type: 'uint256' },
    ],
} as const;

export const REDEEM_TYPE = {
    Redeem: [
        { name: 'user', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'wethAmount', type: 'uint256' },
        { name: 'timestamp', type: 'uint256' },
    ],
} as const;

// ERC20 ABI for USDC
export const ERC20_ABI = [
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const;
