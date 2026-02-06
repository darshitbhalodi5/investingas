import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg xs:rounded-xl text-xs xs:text-sm font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(213,206,163,0.15)] hover:shadow-[0_0_25px_rgba(213,206,163,0.3)] hover:bg-primary/95 hover:-translate-y-0.5",
                secondary: "bg-secondary text-primary border border-primary/10 hover:border-primary/30 hover:bg-secondary/80",
                outline: "bg-transparent border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm",
                ghost: "bg-transparent text-foreground hover:bg-secondary/40 hover:text-primary",
                link: "bg-transparent text-primary underline-offset-4 hover:underline",
                premium: "bg-gradient-to-r from-[#D5CEA3] via-[#E5E5CB] to-[#D5CEA3] bg-[length:200%_auto] hover:bg-right text-primary-foreground shadow-[0_0_20px_rgba(213,206,163,0.2)] hover:shadow-[0_0_30px_rgba(213,206,163,0.4)] hover:-translate-y-0.5 transition-all duration-500",
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
