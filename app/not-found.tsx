"use client";

import { SiFueler } from "react-icons/si";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="flex-1 flex items-center justify-center p-4 xs:p-5 sm:p-6 font-sans overflow-hidden">
            <div className="max-w-[calc(100%-2rem)] xs:max-w-sm sm:max-w-md w-full relative z-10">
                {/* Header Section */}
                <div className="text-center mb-4 xs:mb-5 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 bg-secondary border border-border rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-2 xs:mb-3 shadow-2xl">
                        <SiFueler className="w-6 h-6 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                    </div>
                    <Typography variant="h4" align="center" font="serif" className="text-foreground font-bold tracking-tight">
                        Gas Limit Exceeded
                    </Typography>
                </div>

                {/* Transaction Card */}
                <div className="bg-secondary/40 backdrop-blur-md rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-[0_0_40px_rgba(213,206,163,0.15),0_0_80px_rgba(213,206,163,0.08)] space-y-3 xs:space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <div className="space-y-2.5 xs:space-y-3 md:space-y-4">
                        {/* Status Code Row */}
                        <div className="flex justify-between items-center pb-2.5 xs:pb-3">
                            <Typography font="sans" className="text-foreground/40 text-[9px] xs:text-[10px] md:text-xs font-semibold uppercase tracking-widest">
                                Status Code
                            </Typography>
                            <Typography font="sans" className="text-primary-foreground font-mono font-bold text-sm xs:text-base md:text-lg">
                                404
                            </Typography>
                        </div>

                        {/* Error Type Row */}
                        <div className="flex justify-between items-center pb-2.5 xs:pb-3">
                            <Typography font="sans" className="text-foreground/40 text-[9px] xs:text-[10px] md:text-xs font-semibold uppercase tracking-widest">
                                Error Type
                            </Typography>
                            <Typography font="sans" className="text-foreground/90 font-medium text-[11px] xs:text-xs md:text-sm">
                                Route_Not_Found
                            </Typography>
                        </div>

                        {/* Diagnostics Row */}
                        <div className="flex justify-between items-start gap-2 xs:gap-3 md:gap-4 xs:text-sm text-justify">
                            The requested route has been drained or never existed in the gas pool.
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 xs:pt-4 flex flex-col gap-3">
                        <Button
                            fullWidth
                            variant="secondary"
                            size="lg"
                            className="group font-serif"
                            onClick={() => window.location.href = "/"}
                        >
                            Return to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
