/**
 * Contract Configuration
 * ABIs and addresses for all InvestingAs contracts
 */

// Contract Addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
    // Arc L1 Contracts
    gasFuturesHook: process.env.NEXT_PUBLIC_GAS_FUTURES_HOOK || '0x0000000000000000000000000000000000000000',
    usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x0000000000000000000000000000000000000000',
    lifiDiamond: process.env.NEXT_PUBLIC_LIFI_DIAMOND || '0x0000000000000000000000000000000000000000',
} as const;

// Chain Configuration
export const CHAIN_CONFIG = {
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
    {
        "inputs": [
            { "internalType": "contract IPoolManager", "name": "_poolManager", "type": "address" },
            { "internalType": "address", "name": "_purchaseToken", "type": "address" },
            { "internalType": "address", "name": "_weth", "type": "address" },
            { "internalType": "address", "name": "_relayer", "type": "address" },
            { "internalType": "address", "name": "_owner", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{ "internalType": "address", "name": "target", "type": "address" }],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "operator", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "ERC721NonexistentToken",
        "type": "error"
    },
    { "inputs": [], "name": "FailedInnerCall", "type": "error" },
    { "inputs": [], "name": "HookNotImplemented", "type": "error" },
    { "inputs": [], "name": "InsufficientRemainingAmount", "type": "error" },
    { "inputs": [], "name": "InvalidChain", "type": "error" },
    { "inputs": [], "name": "NotOwner", "type": "error" },
    { "inputs": [], "name": "NotPoolManager", "type": "error" },
    { "inputs": [], "name": "NotPositionOwner", "type": "error" },
    { "inputs": [], "name": "NotRelayer", "type": "error" },
    { "inputs": [], "name": "PoolNotSet", "type": "error" },
    { "inputs": [], "name": "PositionExpired", "type": "error" },
    { "inputs": [], "name": "PositionNotExpired", "type": "error" },
    {
        "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    { "inputs": [], "name": "SlippageExceeded", "type": "error" },
    { "inputs": [], "name": "ZeroAmount", "type": "error" },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "approved", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
            { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "FeesWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "oldBridger", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "newBridger", "type": "address" }
        ],
        "name": "LiFiBridgerUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{ "indexed": true, "internalType": "PoolId", "name": "poolId", "type": "bytes32" }],
        "name": "PoolKeySet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "claimer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "wethRefunded", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "feeDeducted", "type": "uint256" }
        ],
        "name": "PositionExpiryClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "usdcAmount", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "wethAmount", "type": "uint256" },
            { "indexed": false, "internalType": "uint96", "name": "lockedGasPriceWei", "type": "uint96" },
            { "indexed": false, "internalType": "string", "name": "targetChain", "type": "string" },
            { "indexed": false, "internalType": "uint40", "name": "expiry", "type": "uint40" }
        ],
        "name": "PositionPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "redeemer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "wethAmount", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "targetChain", "type": "string" },
            { "indexed": false, "internalType": "bool", "name": "isPartial", "type": "bool" }
        ],
        "name": "PositionRedeemed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "oldRelayer", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "newRelayer", "type": "address" }
        ],
        "name": "RelayerUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "EXPIRY_REFUND_FEE_BPS",
        "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_SLIPPAGE_BPS",
        "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PROTOCOL_FEE_BPS",
        "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "accumulatedFees",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "chainName", "type": "string" },
            { "internalType": "uint256", "name": "chainId", "type": "uint256" }
        ],
        "name": "addChain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "int24", "name": "tickLower", "type": "int24" },
                    { "internalType": "int24", "name": "tickUpper", "type": "int24" },
                    { "internalType": "int256", "name": "liquidityDelta", "type": "int256" },
                    { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
                ],
                "internalType": "struct ModifyLiquidityParams",
                "name": "params",
                "type": "tuple"
            },
            { "internalType": "BalanceDelta", "name": "delta0", "type": "int256" },
            { "internalType": "BalanceDelta", "name": "delta1", "type": "int256" },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "afterAddLiquidity",
        "outputs": [
            { "internalType": "bytes4", "name": "", "type": "bytes4" },
            { "internalType": "BalanceDelta", "name": "", "type": "int256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            { "internalType": "uint256", "name": "amount0", "type": "uint256" },
            { "internalType": "uint256", "name": "amount1", "type": "uint256" },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "afterDonate",
        "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
            { "internalType": "int24", "name": "tick", "type": "int24" }
        ],
        "name": "afterInitialize",
        "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "int24", "name": "tickLower", "type": "int24" },
                    { "internalType": "int24", "name": "tickUpper", "type": "int24" },
                    { "internalType": "int256", "name": "liquidityDelta", "type": "int256" },
                    { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
                ],
                "internalType": "struct ModifyLiquidityParams",
                "name": "params",
                "type": "tuple"
            },
            { "internalType": "BalanceDelta", "name": "delta0", "type": "int256" },
            { "internalType": "BalanceDelta", "name": "delta1", "type": "int256" },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "afterRemoveLiquidity",
        "outputs": [
            { "internalType": "bytes4", "name": "", "type": "bytes4" },
            { "internalType": "BalanceDelta", "name": "", "type": "int256" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "bool", "name": "zeroForOne", "type": "bool" },
                    { "internalType": "int256", "name": "amountSpecified", "type": "int256" },
                    { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
                ],
                "internalType": "struct SwapParams",
                "name": "params",
                "type": "tuple"
            },
            { "internalType": "BalanceDelta", "name": "delta", "type": "int256" },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "afterSwap",
        "outputs": [
            { "internalType": "bytes4", "name": "", "type": "bytes4" },
            { "internalType": "int128", "name": "", "type": "int128" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "int24", "name": "tickLower", "type": "int24" },
                    { "internalType": "int24", "name": "tickUpper", "type": "int24" },
                    { "internalType": "int256", "name": "liquidityDelta", "type": "int256" },
                    { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
                ],
                "internalType": "struct ModifyLiquidityParams",
                "name": "params",
                "type": "tuple"
            },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "beforeAddLiquidity",
        "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            { "internalType": "uint256", "name": "amount0", "type": "uint256" },
            { "internalType": "uint256", "name": "amount1", "type": "uint256" },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "beforeDonate",
        "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" }
        ],
        "name": "beforeInitialize",
        "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "int24", "name": "tickLower", "type": "int24" },
                    { "internalType": "int24", "name": "tickUpper", "type": "int24" },
                    { "internalType": "int256", "name": "liquidityDelta", "type": "int256" },
                    { "internalType": "bytes32", "name": "salt", "type": "bytes32" }
                ],
                "internalType": "struct ModifyLiquidityParams",
                "name": "params",
                "type": "tuple"
            },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "beforeRemoveLiquidity",
        "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "sender", "type": "address" },
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "key",
                "type": "tuple"
            },
            {
                "components": [
                    { "internalType": "bool", "name": "zeroForOne", "type": "bool" },
                    { "internalType": "int256", "name": "amountSpecified", "type": "int256" },
                    { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
                ],
                "internalType": "struct SwapParams",
                "name": "params",
                "type": "tuple"
            },
            { "internalType": "bytes", "name": "hookData", "type": "bytes" }
        ],
        "name": "beforeSwap",
        "outputs": [
            { "internalType": "bytes4", "name": "", "type": "bytes4" },
            { "internalType": "int256", "name": "", "type": "int256" },
            { "internalType": "uint24", "name": "", "type": "uint24" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "name": "chainIds",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "claimExpired",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getApproved",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getGasUnitsAvailable",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getHookPermissions",
        "outputs": [
            {
                "components": [
                    { "internalType": "bool", "name": "beforeInitialize", "type": "bool" },
                    { "internalType": "bool", "name": "afterInitialize", "type": "bool" },
                    { "internalType": "bool", "name": "beforeAddLiquidity", "type": "bool" },
                    { "internalType": "bool", "name": "afterAddLiquidity", "type": "bool" },
                    { "internalType": "bool", "name": "beforeRemoveLiquidity", "type": "bool" },
                    { "internalType": "bool", "name": "afterRemoveLiquidity", "type": "bool" },
                    { "internalType": "bool", "name": "beforeSwap", "type": "bool" },
                    { "internalType": "bool", "name": "afterSwap", "type": "bool" },
                    { "internalType": "bool", "name": "beforeDonate", "type": "bool" },
                    { "internalType": "bool", "name": "afterDonate", "type": "bool" },
                    { "internalType": "bool", "name": "beforeSwapReturnDelta", "type": "bool" },
                    { "internalType": "bool", "name": "afterSwapReturnDelta", "type": "bool" },
                    { "internalType": "bool", "name": "afterAddLiquidityReturnDelta", "type": "bool" },
                    { "internalType": "bool", "name": "afterRemoveLiquidityReturnDelta", "type": "bool" }
                ],
                "internalType": "struct Hooks.Permissions",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getPosition",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "wethAmount", "type": "uint256" },
                    { "internalType": "uint256", "name": "remainingWethAmount", "type": "uint256" },
                    { "internalType": "uint96", "name": "lockedGasPriceWei", "type": "uint96" },
                    { "internalType": "uint40", "name": "purchaseTimestamp", "type": "uint40" },
                    { "internalType": "uint40", "name": "expiry", "type": "uint40" },
                    { "internalType": "string", "name": "targetChain", "type": "string" }
                ],
                "internalType": "struct InvestInGasHook.GasPosition",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "operator", "type": "address" }
        ],
        "name": "isApprovedForAll",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "liFiBridger",
        "outputs": [{ "internalType": "contract ILiFiBridger", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "ownerOf",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolKey",
        "outputs": [
            { "internalType": "Currency", "name": "currency0", "type": "address" },
            { "internalType": "Currency", "name": "currency1", "type": "address" },
            { "internalType": "uint24", "name": "fee", "type": "uint24" },
            { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
            { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolManager",
        "outputs": [{ "internalType": "contract IPoolManager", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "positions",
        "outputs": [
            { "internalType": "uint256", "name": "wethAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "remainingWethAmount", "type": "uint256" },
            { "internalType": "uint96", "name": "lockedGasPriceWei", "type": "uint96" },
            { "internalType": "uint40", "name": "purchaseTimestamp", "type": "uint40" },
            { "internalType": "uint40", "name": "expiry", "type": "uint40" },
            { "internalType": "string", "name": "targetChain", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "usdcAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "minWethOut", "type": "uint256" },
            { "internalType": "uint96", "name": "lockedGasPriceWei", "type": "uint96" },
            { "internalType": "string", "name": "targetChain", "type": "string" },
            { "internalType": "uint40", "name": "expiryDuration", "type": "uint40" },
            { "internalType": "address", "name": "buyer", "type": "address" }
        ],
        "name": "purchasePosition",
        "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "purchaseToken",
        "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "uint256", "name": "wethAmount", "type": "uint256" },
            { "internalType": "bytes", "name": "lifiData", "type": "bytes" },
            { "internalType": "address", "name": "recipient", "type": "address" }
        ],
        "name": "redeemPosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "relayer",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "operator", "type": "address" },
            { "internalType": "bool", "name": "approved", "type": "bool" }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_liFiBridger", "type": "address" }],
        "name": "setLiFiBridger",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "Currency", "name": "currency0", "type": "address" },
                    { "internalType": "Currency", "name": "currency1", "type": "address" },
                    { "internalType": "uint24", "name": "fee", "type": "uint24" },
                    { "internalType": "int24", "name": "tickSpacing", "type": "int24" },
                    { "internalType": "contract IHooks", "name": "hooks", "type": "address" }
                ],
                "internalType": "struct PoolKey",
                "name": "_poolKey",
                "type": "tuple"
            }
        ],
        "name": "setPoolKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_relayer", "type": "address" }],
        "name": "setRelayer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
        "name": "supportsInterface",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "weth",
        "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "to", "type": "address" }],
        "name": "withdrawFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
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
