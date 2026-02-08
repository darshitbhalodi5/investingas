# InvestInGas Frontend

The **InvestInGas Frontend** is a premium, institutional-grade terminal built with Next.js and Tailwind CSS. It provides a high-fidelity user interface for hedging against Ethereum gas price volatility using Uniswap v4 Hook-based gas positions.

## Core Features

- **Institutional Dashboard**: A terminal-style interface with a focus on "Tactical Alpha," featuring real-time state monitoring and institutional hedging signals.
- **Interactive Notifications**: Integrated **Sonner** toaster for real-time transaction feedback (Loading → Success/Error states).
- **Real-time Gas Ticker**: High-frequency feeds of gas prices across major EVM chains (Arbitrum, Base, Optimism, Sepolia).
- **Position Management**: Comprehensive portfolio view for monitoring and redeeming NFT-represented gas futures.
- **Cross-Chain Settle**: Seamlessly redeem gas positions for native ETH on any supported target chain via LI.FI integration.

## Source Code Structure (`app/`, `components/`, `hooks/`)

### Architecture (`app/`)
- `app/dashboard/`: The primary control plane for managing gas positions and analytics.
- `app/dashboard/buy/`: The specialized acquisition flow for securing new gas unit inventory.
- `app/layout.tsx`: Root layout with **Sonner Toaster** and global Providers.

### Components (`components/`)
- `components/dashboard/`: Sophisticated UI for position management, terminal logs, and tactical alpha signals.
- `components/ui/`: Atomic design components optimized for wait-times and responsive interaction.
- `GasTicker.tsx`: The high-frequency price feed display with trend indicators.

### Custom Hooks (`hooks/`)
- `useGasPrices.ts`: Manages real-time price fetching and staleness logic via the Relayer.
- `useGasFutures.ts`: Core logic for position lifecycle (Signed EIP-712 intents for Gasless-like UX).

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- [Yarn](https://yarnpkg.com/) (Preferred)
- EIP-1193 compatible wallet (MetaMask, Rainbow, etc.)

### 2. Installation
```bash
# Install dependencies
yarn install

# Run the development server
yarn dev
```

### 3. Build & Production
```bash
# Create an optimized build
yarn build

# Start production server
yarn start
```

## 🛠 Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with custom glassmorphism utilities.
- **Web3**: [Wagmi](https://wagmi.sh), [Viem](https://viem.sh), [RainbowKit](https://www.rainbowkit.com/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/) (Custom themed)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Ri library)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & React Context

