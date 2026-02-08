# InvestInGas Frontend

The **InvestInGas Frontend** is a modern, high-performance web application built with Next.js and Tailwind CSS. it provides a seamless user experience for hedging against Ethereum gas price volatility using Uniswap v4 Hook-based gas positions.

## Core Features

- **Real-time Gas Ticker**: Live feeds of gas prices across multiple EVM chains (Ethereum, Arbitrum, Base, Polygon, Optimism) fetched via the Sui Oracle.
- **Gas Positioning**: Interface to purchase NFT-represented gas futures using USDC.
- **Position Management**: Dashboard for users to view, monitor, and redeem their active gas positions.
- **Cross-Chain Redemption**: Seamlessly redeem gas positions for native gas on target chains via LiFi integration.
- **Smart Analytics**: Visualization of 24-hour gas price trends and "Buy Signals" for optimal entry.

## Source Code Structure (`app/`, `components/`, `hooks/`)

### Architecture (`app/`)
- `app/dashboard/`: The main authenticated area for managing gas positions.
- `app/buy/`: The specialized flow for purchasing new gas positions.
- `app/layout.tsx`: Root layout with global providers (Web3, Theme).

### Components (`components/`)
- `components/home/`: Landing page sections (Hero, Architecture, Technical details).
- `components/dashboard/`: Specific UI for position cards and list views.
- `components/ui/`: Reusable, atomic design components built with Radix UI and Tailwind.
- `GasTicker.tsx`: The high-frequency price feed display.

### Custom Hooks (`hooks/`)
- `useGasPrices.ts`: Manages real-time price fetching and staleness logic via the Relayer.
- `useGasFutures.ts`: Core logic for position lifecycle (purchasing, redeeming, claiming).
- `useUniswap.ts`: Specialized integration for Uniswap v4 specific parameters and constants.

### Library & Utilities (`lib/`)
- `lib/api.ts`: Centralized client for Relayer V2 API interactions.
- `lib/contracts.ts`: ABI definitions and contract address management for Sepolia.
- `lib/lifi.ts`: Helper for cross-chain quote fetching and visualization.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- [MetaMask](https://metamask.io/) or any EIP-1193 compatible wallet.

### 2. Installation
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### 3. Configuration
Copy the `.env.local` template:
```bash
NEXT_PUBLIC_RELAYER_URL=http://localhost:3001
NEXT_PUBLIC_LIFI_API_KEY=your_lifi_key_here
```

## 🛠 Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Web3**: [Wagmi](https://wagmi.sh), [Viem](https://viem.sh), [ConnectKit](https://docs.family.co/connectkit)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **State Management**: React Context & Hooks

