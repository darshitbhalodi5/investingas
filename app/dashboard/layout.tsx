"use client";

import { Navbar } from "../../components/layout/Navbar";
import { GasTicker } from "../../components/GasTicker";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24">
                <GasTicker />
            </div>
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
