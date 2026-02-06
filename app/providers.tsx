"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, base, arbitrum, polygon, optimism } from "wagmi/chains";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";

// Configure chains
const config = createConfig({
    chains: [mainnet, base, arbitrum, polygon, optimism],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
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
