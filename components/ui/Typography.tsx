import React, { ElementType, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
    variants: {
        variant: {
            h1: "text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-tight",
            h2: "text-xl xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-semibold tracking-tight",
            h3: "text-lg xs:text-xl sm:text-2xl font-semibold tracking-tight",
            h4: "text-base xs:text-lg sm:text-xl font-semibold tracking-tight",
            h5: "text-sm xs:text-base sm:text-lg font-semibold tracking-tight",
            h6: "text-sm xs:text-sm sm:text-base font-semibold tracking-tight",
            body: "text-sm xs:text-base leading-6 xs:leading-7",
            bodyLarge: "text-base xs:text-lg leading-6 xs:leading-7",
            bodySmall: "text-xs xs:text-sm leading-5 xs:leading-6",
            caption: "text-[10px] xs:text-xs",
            lead: "text-base xs:text-lg sm:text-xl text-muted-foreground leading-6 xs:leading-7",
            muted: "text-xs xs:text-sm text-muted-foreground",
            code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs xs:text-sm font-semibold",
        },
        align: {
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        },
        font: {
            sans: "font-sans",
            serif: "font-serif",
        },
    },
    defaultVariants: {
        variant: "body",
        align: "left",
        font: "sans",
    },
});

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: ElementType;
}

const defaultElements = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    body: "p",
    bodyLarge: "p",
    bodySmall: "p",
    caption: "p",
    lead: "p",
    muted: "p",
    code: "code",
} as const;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = "body", align, font, as, ...props }, ref) => {
        const Component = (as ||
            (variant && defaultElements[variant]) ||
            "p") as ElementType;

        return (
            <Component
                className={cn(typographyVariants({ variant, align, font }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);

Typography.displayName = "Typography";
