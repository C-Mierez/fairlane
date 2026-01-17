import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
    "flex items-center justify-center border-foreground whitespace-nowrap font-brand transition-colors duration-100 ring-offset-white gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                primary: "bg-primary text-primary-foreground",
                inverted: "bg-foreground text-background",
                transparent: "bg-transparent text-foreground",
                link: "bg-transparent underline",
            },
            shadow: {
                none: "shadow-none",
                neo: "neo-shadow",
            },
            rise: {
                none: "",
                neo: "neo-hover",
                reverse: "neo-hover-reverse",
            },
            border: {
                none: "border-0",
                transparent: "border-1 border-transparent",
                neo: "border-neo",
            },
            hover: {
                none: "",
                to_primary: "hover:bg-primary hover:text-primary-foreground",
                to_background: "hover:bg-background hover:text-foreground",
                to_foreground: "hover:bg-foreground hover:text-background",
                ghost: "hover:!border-foreground",
                ghost_inverted: "hover:!border-background",
            },
            radius: {
                default: "rounded-base",
                none: "rounded-none",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "size-10 aspect-square",
                expanded: "size-full px-4 py-2",
                link: "p-0 h-min",
            },
            font_size: {
                default: "text-sm",
                lg: "text-base xl:text-lg",
                xs: "text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            shadow: "none",
            rise: "neo",
            hover: "none",
            radius: "default",
            border: "neo",
            size: "default",
            font_size: "default",
        },
    },
);

function Button({
    className,
    variant,
    shadow,
    rise,
    hover,
    radius,
    border,
    size,
    font_size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, shadow, rise, border, hover, radius, size, font_size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
