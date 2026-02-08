"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoClose, IoWallet } from "react-icons/io5";
import logoImage from "@/assets/InvestInGas.svg";
import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Buy Credits", href: "/dashboard/buy" },
    { label: "My Credits", href: "/dashboard/credits" },
    { label: "Analytics", href: "/dashboard/analytics" },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <nav className="sticky top-0 z-50 w-full h-16 md:h-20 bg-background backdrop-blur-xl shadow-[inset_0_-1px_0_rgba(213,206,163,0.1)] flex items-center transition-all duration-300">
                <div className="w-full">
                    <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-28 h-8 xs:w-32 xs:h-10 sm:w-36 sm:h-10 md:w-40 md:h-12 flex items-center justify-start">
                                <Image
                                    src={logoImage}
                                    alt="InvestInGas Logo"
                                    width={160}
                                    height={48}
                                    priority
                                    loading="eager"
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-3 py-2 xl:px-4 transition-all rounded-lg relative group border border-transparent",
                                            isActive
                                                ? "bg-secondary border-[#D5CEA3]/20 shadow-[0_0_15px_rgba(213,206,163,0.1)]"
                                                : "hover:bg-secondary hover:border-[#D5CEA3]/10"
                                        )}
                                    >
                                        <Typography
                                            variant="body"
                                            className={cn(
                                                "transition-colors font-medium relative z-10",
                                                isActive ? "text-primary" : "text-foreground/70 group-hover:text-primary"
                                            )}
                                        >
                                            {item.label}
                                        </Typography>

                                        {/* Active Route Indicator Dot */}
                                        {isActive && (
                                            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#D5CEA3] animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                            {/* Connect Wallet */}
                            <div className="block">
                                <ConnectButton.Custom>
                                    {({
                                        account,
                                        chain,
                                        openAccountModal,
                                        openChainModal,
                                        openConnectModal,
                                        authenticationStatus,
                                        mounted,
                                    }) => {
                                        const ready = mounted && authenticationStatus !== 'loading';
                                        const connected =
                                            ready &&
                                            account &&
                                            chain &&
                                            (!authenticationStatus ||
                                                authenticationStatus === 'authenticated');

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
                                                {(() => {
                                                    if (!connected) {
                                                        return (
                                                            <>
                                                                <Button
                                                                    onClick={openConnectModal}
                                                                    className="hidden lg:flex px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(213,206,163,0.3)] transition-all"
                                                                >
                                                                    Connect Wallet
                                                                </Button>
                                                                <Button
                                                                    onClick={openConnectModal}
                                                                    className="lg:hidden p-2 text-primary-foreground hover:shadow-[0_0_15px_rgba(213,206,163,0.3)] transition-all bg-primary rounded-lg"
                                                                    aria-label="Connect Wallet"
                                                                >
                                                                    <IoWallet className="w-5 h-5 xs:w-6 xs:h-6" />
                                                                </Button>
                                                            </>
                                                        );
                                                    }

                                                    if (chain.unsupported) {
                                                        return (
                                                            <Button onClick={openChainModal} className="px-3 py-1.5 bg-red-500 text-foreground rounded-lg font-medium text-sm">
                                                                Wrong network
                                                            </Button>
                                                        );
                                                    }

                                                    return (
                                                        <div className="hidden lg:flex items-center gap-3">
                                                            <Button
                                                                onClick={openChainModal}
                                                                className="flex items-center gap-1 bg-primary hover:bg-primary/80 p-1.5 rounded-lg transition-colors text-foreground"
                                                            >
                                                                {chain.hasIcon && (
                                                                    <div
                                                                        style={{
                                                                            background: chain.iconBackground,
                                                                            width: 24,
                                                                            height: 24,
                                                                            borderRadius: 999,
                                                                            overflow: 'hidden',
                                                                        }}
                                                                    >
                                                                        {chain.iconUrl && (
                                                                            <img
                                                                                alt={chain.name ?? 'Chain icon'}
                                                                                src={chain.iconUrl}
                                                                                style={{ width: 24, height: 24 }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </Button>

                                                            <Button
                                                                onClick={openAccountModal}
                                                                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(213,206,163,0.3)] px-3 py-1.5 rounded-lg transition-all font-medium"
                                                            >
                                                                {account.displayName}
                                                            </Button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        );
                                    }}
                                </ConnectButton.Custom>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <Button
                                className="lg:hidden p-2 text-foreground/70 hover:text-primary hover:bg-secondary transition-colors rounded-lg"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                {mobileMenuOpen ? <IoClose className="w-5 h-5 xs:w-6 xs:h-6" /> : <IoMenu className="w-5 h-5 xs:w-6 xs:h-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-xs bg-background/90 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header with Close */}
                        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
                            <Typography variant="h4" className="text-foreground font-bold ml-2 font-serif">Menu</Typography>
                            <Button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-lg transition-all"
                            >
                                <IoClose className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col p-4 gap-2">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-4 py-3 transition-all rounded-xl text-center border border-transparent",
                                            isActive
                                                ? "bg-secondary border-[#D5CEA3]/20 shadow-[0_0_15px_rgba(213,206,163,0.1)]"
                                                : "hover:bg-secondary hover:border-[#D5CEA3]/20 hover:shadow-[0_0_15px_rgba(213,206,163,0.15)]"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Typography
                                            variant="body"
                                            className={cn(
                                                "font-medium text-lg transition-colors",
                                                isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                                            )}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Link>
                                );
                            })}

                            {/* Wallet Logic in Menu */}
                            <div className="mt-4 pt-4 border-t border-foreground/10 flex justify-center">
                                <ConnectButton showBalance={false} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
