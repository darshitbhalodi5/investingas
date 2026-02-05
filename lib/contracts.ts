/**
 * Contract Configuration
 * ABIs and addresses for all InvestingAs contracts
 */

// Contract Addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
    // Arc L1 Contracts
    arcGasFutures: process.env.NEXT_PUBLIC_ARC_GAS_FUTURES || '0x0000000000000000000000000000000000000000',
    gasFuturesHook: process.env.NEXT_PUBLIC_GAS_FUTURES_HOOK || '0x0000000000000000000000000000000000000000',
    usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x0000000000000000000000000000000000000000',
    lifiDiamond: process.env.NEXT_PUBLIC_LIFI_DIAMOND || '0x0000000000000000000000000000000000000000',
} as const;

// Chain Configuration
export const CHAIN_CONFIG = {
    arc: {
        id: 42069, // Arc testnet chain ID (example)
        name: 'Arc Testnet',
        rpcUrl: process.env.NEXT_PUBLIC_ARC_RPC || 'https://rpc.testnet.arc.io',
        blockExplorer: 'https://explorer.testnet.arc.io',
    },
} as const;

// Supported chains for gas credits
export const SUPPORTED_CHAINS = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', chainId: 1 },
    { id: 'base', name: 'Base', symbol: 'ETH', chainId: 8453 },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', chainId: 42161 },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', chainId: 137 },
    { id: 'optimism', name: 'Optimism', symbol: 'ETH', chainId: 10 },
] as const;

// InvestInGasHook ABI (Uniswap v4)
export const INVEST_IN_GAS_HOOK_ABI = [
    // Core Functions
    {
        name: 'purchasePosition',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'usdcAmount', type: 'uint256' },
            { name: 'minWethOut', type: 'uint256' },
            { name: 'lockedGasPriceWei', type: 'uint96' },
            { name: 'targetChain', type: 'string' },
            { name: 'expiryDuration', type: 'uint40' },
            { name: 'buyer', type: 'address' },
        ],
        outputs: [{ name: 'tokenId', type: 'uint256' }],
    },
    {
        name: 'redeemPosition',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'tokenId', type: 'uint256' },
            { name: 'wethAmount', type: 'uint256' },
            { name: 'lifiData', type: 'bytes' },
            { name: 'recipient', type: 'address' },
        ],
        outputs: [],
    },
    // View Functions
    {
        name: 'getPosition',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [{
            name: '',
            type: 'tuple',
            components: [
                { name: 'wethAmount', type: 'uint256' },
                { name: 'remainingWethAmount', type: 'uint256' },
                { name: 'lockedGasPriceWei', type: 'uint96' },
                { name: 'purchaseTimestamp', type: 'uint40' },
                { name: 'expiry', type: 'uint40' },
                { name: 'targetChain', type: 'string' },
            ],
        }],
    },
    {
        name: 'getGasUnitsAvailable',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'relayer',
        type: 'function',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
    },
] as const;

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
