import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg xs:rounded-xl text-xs xs:text-sm font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A77979] focus-visible:ring-offset-2 focus-visible:ring-offset-[#472D2D]",
    {
        variants: {
            variant: {
                primary: "bg-[#A77979] text-white shadow-lg shadow-[#A77979]/20 hover:bg-[#A77979]/90",
                secondary: "bg-[#553939] text-white border border-[#704F4F] hover:bg-[#704F4F] shadow-xl",
                outline: "bg-transparent border border-[#704F4F] text-white/90 hover:bg-[#553939]/50",
                ghost: "bg-transparent text-white/70 hover:bg-[#A77979]/10 hover:text-white",
                link: "bg-transparent text-[#A77979] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2 xs:h-11 xs:px-5 sm:h-12 sm:px-6 sm:py-3",
                sm: "h-8 px-3 text-xs xs:h-9 xs:px-4",
                lg: "h-11 px-6 text-sm xs:h-12 xs:px-8 sm:h-14 sm:px-10 sm:text-base rounded-xl sm:rounded-2xl",
                icon: "h-9 w-9 xs:h-10 xs:w-10",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
