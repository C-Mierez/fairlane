import { ComponentProps } from "react";

import { cn } from "@lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const variants = cva(
    "rounded-base border-border bg-background selection:bg-primary selection:text-primary-foreground text-foreground placeholder:text-foreground/50 border-neo flex h-10 w-full px-3 py-2 font-sans text-sm file:border-0 file:bg-transparent file:text-sm disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            focus: {
                default:
                    "focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-3 focus-visible:outline-hidden",
                none: "focus-visible:ring-0 focus-visible:outline-none",
            },
        },
        defaultVariants: {
            focus: "default",
        },
    },
);

function Input({ className, type, focus, ...props }: ComponentProps<"input"> & VariantProps<typeof variants>) {
    return <input type={type} data-slot="input" className={cn(variants({ focus }), className)} {...props} />;
}

export { Input };
