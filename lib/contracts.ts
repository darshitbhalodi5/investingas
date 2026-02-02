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

// ArcGasFutures ABI (key functions only)
export const ARC_GAS_FUTURES_ABI = [
    // Read Functions
    {
        name: 'getUserCredits',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{
            name: '',
            type: 'tuple[]',
            components: [
                { name: 'id', type: 'uint256' },
                { name: 'owner', type: 'address' },
                { name: 'targetChain', type: 'string' },
                { name: 'gasUnits', type: 'uint256' },
                { name: 'remainingGasUnits', type: 'uint256' },
                { name: 'lockedPriceGwei', type: 'uint256' },
                { name: 'usdcPaid', type: 'uint256' },
                { name: 'purchaseTime', type: 'uint256' },
                { name: 'expiryTime', type: 'uint256' },
                { name: 'isActive', type: 'bool' },
            ],
        }],
    },
    {
        name: 'getGasPriceData',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'chain', type: 'string' }],
        outputs: [{
            name: '',
            type: 'tuple',
            components: [
                { name: 'currentPriceGwei', type: 'uint256' },
                { name: 'volatility24h', type: 'uint256' },
                { name: 'high24h', type: 'uint256' },
                { name: 'low24h', type: 'uint256' },
                { name: 'lastUpdated', type: 'uint256' },
            ],
        }],
    },
    {
        name: 'calculateSavings',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'creditId', type: 'uint256' },
            { name: 'user', type: 'address' },
            { name: 'gasUnitsToUse', type: 'uint256' },
        ],
        outputs: [
            { name: 'savingsUSDC', type: 'uint256' },
            { name: 'lockedCost', type: 'uint256' },
            { name: 'currentCost', type: 'uint256' },
        ],
    },
    {
        name: 'userSavings',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'userPayouts',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'getAvailableBalance',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    // Write Functions
    {
        name: 'purchaseCredits',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'usdcAmount', type: 'uint256' },
            { name: 'targetChain', type: 'string' },
            { name: 'expiryDays', type: 'uint256' },
        ],
        outputs: [{ name: 'creditId', type: 'uint256' }],
    },
    {
        name: 'redeemCredits',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'creditId', type: 'uint256' },
            { name: 'gasUnitsToUse', type: 'uint256' },
        ],
        outputs: [{ name: 'savedAmount', type: 'uint256' }],
    },
    {
        name: 'redeemCredits',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'creditId', type: 'uint256' },
            { name: 'gasUnitsToUse', type: 'uint256' },
            {
                name: 'options', type: 'tuple', components: [
                    { name: 'cashSettlement', type: 'bool' },
                    { name: 'lifiData', type: 'bytes' },
                ]
            },
        ],
        outputs: [{ name: 'savedAmount', type: 'uint256' }],
    },
    {
        name: 'transferCreditsPartial',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'creditId', type: 'uint256' },
            { name: 'to', type: 'address' },
            { name: 'gasUnitsToTransfer', type: 'uint256' },
        ],
        outputs: [{ name: 'newCreditId', type: 'uint256' }],
    },
] as const;

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
