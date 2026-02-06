"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoClose, IoWallet } from "react-icons/io5";
import logoImage from "@/assets/InvestInGas.svg";
import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Buy Credits", href: "/dashboard/buy" },
    { label: "My Credits", href: "/dashboard/credits" },
    { label: "Analytics", href: "/dashboard/analytics" },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 w-full h-16 md:h-20 bg-[#472D2D]/80 backdrop-blur-xl border-b border-[#704F4F]/20 shadow-lg flex items-center transition-all duration-300">
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
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-3 py-2 xl:px-4 hover:bg-white/5 transition-all rounded-lg"
                                >
                                    <Typography variant="body" className="text-white/70 hover:text-white font-medium">
                                        {item.label}
                                    </Typography>
                                </Link>
                            ))}
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
                                                                    className="hidden lg:flex px-4 py-2 bg-[#A77979] text-white font-bold rounded-lg hover:bg-[#a77979]/80 transition-colors"
                                                                >
                                                                    Connect Wallet
                                                                </Button>
                                                                <Button
                                                                    onClick={openConnectModal}
                                                                    className="lg:hidden p-2 text-white/70 hover:text-white transition-colors bg-[#A77979] rounded-lg"
                                                                    aria-label="Connect Wallet"
                                                                >
                                                                    <IoWallet className="w-5 h-5 xs:w-6 xs:h-6" />
                                                                </Button>
                                                            </>
                                                        );
                                                    }

                                                    if (chain.unsupported) {
                                                        return (
                                                            <Button onClick={openChainModal} className="px-3 py-1.5 bg-red-500 text-white rounded-lg font-medium text-sm">
                                                                Wrong network
                                                            </Button>
                                                        );
                                                    }

                                                    return (
                                                        <div className="hidden lg:flex items-center gap-3">
                                                            <Button
                                                                onClick={openChainModal}
                                                                className="flex items-center gap-1 bg-[#A77979] hover:bg-[#a77979]/80 p-1.5 rounded-lg transition-colors"
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
                                                                className="flex items-center gap-2 bg-[#A77979] hover:bg-[#a77979]/80 px-2 py-1.5 rounded-lg transition-colors"
                                                            >
                                                                {account.displayName}
                                                                {account.displayBalance
                                                                    ? ` (${account.displayBalance})`
                                                                    : ''}
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
                                className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
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
                    <div className="relative w-full max-w-xs bg-[#472D2D]/90 backdrop-blur-xl border border-[#704F4F]/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header with Close */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <Typography variant="h4" className="text-white font-bold ml-2 font-serif">Menu</Typography>
                            <Button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <IoClose className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col p-4 gap-2">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-3 hover:bg-white/5 transition-all rounded-xl text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Typography variant="body" className="text-white/80 hover:text-white font-medium text-lg">
                                        {item.label}
                                    </Typography>
                                </Link>
                            ))}

                            {/* Wallet Logic in Menu */}
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-center">
                                <ConnectButton />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
