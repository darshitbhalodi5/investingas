"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Fuel, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-2xl">
                <div className="container mx-auto px-6 flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                            <Fuel className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            Investing<span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">As</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/dashboard" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Dashboard</Link>
                        <Link href="/dashboard/buy" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Buy Credits</Link>
                        <Link href="/dashboard/trade" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Trade</Link>
                        <Link href="/dashboard/analytics" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Analytics</Link>
                    </div>

                    {/* Connect Wallet */}
                    <div className="hidden md:block">
                        <ConnectButton
                            showBalance={false}
                            chainStatus="icon"
                            accountStatus="avatar"
                        />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white/70 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 py-4 px-6">
                        <div className="flex flex-col gap-2">
                            <Link href="/dashboard" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Dashboard</Link>
                            <Link href="/dashboard/buy" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Buy Credits</Link>
                            <Link href="/dashboard/trade" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Trade</Link>
                            <Link href="/dashboard/analytics" className="px-4 py-2 text-white/70 font-medium rounded-lg hover:text-white hover:bg-white/5 transition-all">Analytics</Link>
                            <div className="mt-4">
                                <ConnectButton />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
