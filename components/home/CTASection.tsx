"use client";

import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";

export function CTASection() {
    return (
        <section className="container mx-auto px-6 py-8 lg:py-12">
            <div className="text-center max-w-2xl mx-auto">
                <Typography variant="h2" align="center" className="mb-6">
                    Ready to Stop <span className="text-red-400">Overpaying</span>?
                </Typography>
                <Typography variant="lead" align="center" className="text-[#E5E5CB]/60 mb-4">
                    Join thousands of DeFi users who are saving money on gas fees every day.
                </Typography>
                <Link
                    href="/dashboard/buy"
                    className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 xs:gap-3 px-6 py-3 xs:px-8 xs:py-4 bg-gradient-to-r from-[#D5CEA3] to-[#E5E5CB] text-[#1A120B] font-bold rounded-xl xs:rounded-2xl hover:from-[#E5E5CB] hover:to-[#D5CEA3] transition-all shadow-[0_0_20px_rgba(213,206,163,0.3)] hover:shadow-[0_0_30px_rgba(213,206,163,0.5)] transform hover:-translate-y-1 text-sm xs:text-base"
                >
                    Buy Credits Now
                    <HiArrowUpRight className="w-6 h-6 sm:w-4 sm:h-4" />
                </Link>
            </div>
        </section>
    );
}
