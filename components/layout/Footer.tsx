import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { ImFire } from "react-icons/im";
import { Typography } from "@/components/ui/Typography";

export function Footer() {
    return (
        <footer className="w-full bg-background/80 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(213,206,163,0.1)] h-16 md:h-20 shrink-0 flex items-center">
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Gas Icon (Left) */}
                <Link href="/" className="group icon-btn-glass">
                    <ImFire className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-[#FFB547] transition-colors" />
                </Link>

                {/* Copyright (Center) */}
                <Typography variant="caption" className="text-foreground font-medium text-center text-xs md:text-sm">
                    © 2026 InvestInGas. All rights reserved.
                </Typography>

                {/* GitHub Link (Right) */}
                <Link
                    href="https://github.com/orgs/InvestInGas/repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group icon-btn-glass"
                    aria-label="GitHub"
                >
                    <FaGithub className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-white transition-colors" />
                </Link>
            </div>
        </footer>
    );
}
