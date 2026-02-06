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
            accentColor: "#A77979",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system" as const,
            overlayBlur: "small" as const,
        }),
        colors: {
            ...darkTheme().colors,
            accentColor: "#A77979",
            modalBackground: "#472D2D",
            profileForeground: "#553939",
            modalBorder: "#704F4F",
            connectButtonBackground: "#553939",
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
