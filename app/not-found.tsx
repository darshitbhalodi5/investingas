"use client";

import { SiFueler } from "react-icons/si";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="flex-1 flex items-center justify-center p-4 xs:p-5 sm:p-6 font-sans overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] xs:w-[45%] sm:w-[40%] h-[50%] xs:h-[45%] sm:h-[40%] bg-[#A77979]/5 blur-[80px] xs:blur-[100px] sm:blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] xs:w-[45%] sm:w-[40%] h-[50%] xs:h-[45%] sm:h-[40%] bg-[#704F4F]/10 blur-[80px] xs:blur-[100px] sm:blur-[120px] rounded-full" />
            </div>

            <div className="max-w-[calc(100%-2rem)] xs:max-w-sm sm:max-w-md w-full relative z-10">
                {/* Header Section */}
                <div className="text-center mb-4 xs:mb-5 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 bg-[#553939] border border-[#704F4F] rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-2 xs:mb-3 shadow-2xl">
                        <SiFueler className="w-6 h-6 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-[#A77979]" />
                    </div>
                    <Typography variant="h4" align="center" font="serif" className="text-white font-bold tracking-tight">
                        Gas Limit Exceeded
                    </Typography>
                </div>

                {/* Transaction Card */}
                <div className="bg-[#553939]/40 backdrop-blur-md border border-[#704F4F]/50 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-2xl space-y-3 xs:space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <div className="space-y-2.5 xs:space-y-3 md:space-y-4">
                        {/* Status Code Row */}
                        <div className="flex justify-between items-center pb-2.5 xs:pb-3 border-b border-[#704F4F]/30">
                            <Typography font="sans" className="text-white/40 text-[9px] xs:text-[10px] md:text-xs font-semibold uppercase tracking-widest">
                                Status Code
                            </Typography>
                            <Typography font="sans" className="text-[#A77979] font-mono font-bold text-sm xs:text-base md:text-lg">
                                404
                            </Typography>
                        </div>

                        {/* Error Type Row */}
                        <div className="flex justify-between items-center pb-2.5 xs:pb-3 border-b border-[#704F4F]/30">
                            <Typography font="sans" className="text-white/40 text-[9px] xs:text-[10px] md:text-xs font-semibold uppercase tracking-widest">
                                Error Type
                            </Typography>
                            <Typography font="sans" className="text-white/90 font-medium italic text-[11px] xs:text-xs md:text-sm">
                                Route_Not_Found
                            </Typography>
                        </div>

                        {/* Diagnostics Row */}
                        <div className="flex justify-between items-start gap-2 xs:gap-3 md:gap-4">
                            <Typography font="sans" className="text-white/40 text-[9px] xs:text-[10px] md:text-xs font-semibold uppercase tracking-widest pt-0.5 xs:pt-1 shrink-0">
                                Diagnostics
                            </Typography>
                            <Typography font="sans" className="text-white/70 text-[11px] xs:text-xs text-right leading-relaxed">
                                The requested route has been drained or never existed in the gas pool.
                            </Typography>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 xs:pt-4 flex flex-col gap-3">
                        <Button
                            fullWidth
                            variant="primary"
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
