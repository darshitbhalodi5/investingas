"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, baseSepolia, arbitrumSepolia, optimismSepolia, polygonAmoy } from "wagmi/chains";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

// Configure chains
const config = createConfig({
    chains: [sepolia, baseSepolia, arbitrumSepolia, optimismSepolia, polygonAmoy],
    transports: {
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
        [arbitrumSepolia.id]: http(),
        [optimismSepolia.id]: http(),
        [polygonAmoy.id]: http(),
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    const customTheme = {
        ...darkTheme({
            accentColor: "#D5CEA3",
            accentColorForeground: "#1A120B",
            borderRadius: "large",
            fontStack: "system" as const,
            overlayBlur: "small" as const,
        }),
        colors: {
            ...darkTheme().colors,
            accentColor: "#D5CEA3",
            modalBackground: "#1A120B",
            profileForeground: "#1A120B",
            modalBorder: "#3C2A21",
            connectButtonBackground: "#D5CEA3",
            connectButtonText: "#1A120B",
        },
    };

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={customTheme} modalSize="compact">
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
