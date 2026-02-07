"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconType } from "react-icons";
import { Button } from "@/components/ui/Button";

interface ConnectWalletPromptProps {
    title: string;
    description: string;
    icon: IconType;
}

export function ConnectWalletPrompt({ title, description, icon: Icon }: ConnectWalletPromptProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <Icon className="w-10 h-10 text-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-foreground/60 mb-8 max-w-md">
                {description}
            </p>
            <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                    const ready = mounted;
                    return (
                        <div
                            {...(!ready && {
                                'aria-hidden': true,
                                'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                        >
                            <Button
                                onClick={openConnectModal}
                                variant="primary"
                                size="lg"
                                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(213,206,163,0.4)] transition-all text-lg"
                            >
                                Connect Wallet
                            </Button>
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    );
}
