import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
    "flex items-center justify-center whitespace-nowrap font-base transition-colors ring-offset-white gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "text-foreground bg-background",
                activePrimary: "text-primary-foreground bg-primary",
                nav: "bg-background text-foreground",
                primary: "bg-background text-foreground hover:bg-primary hover:text-primary-foreground",
                primaryAlt: "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
                background: "text-foreground bg-transparent hover:bg-background hover:text-foreground",
            },
            hover: {
                default: "neo-container neo-hover",
                reverse: "neo-container-reverse neo-hover-reverse",
                none: "",
                ghost: "neo-container duration-200 !border-transparent hover:!border-foreground",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "size-10",
                expanded: "size-full px-4 py-2",
            },
            font_size: {
                default: "text-sm",
                lg: "text-base xl:text-lg",
                xs: "text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            hover: "default",
            size: "default",
            font_size: "default",
        },
    },
);

interface Props {
    keepHovered?: boolean;
}

function Button({
    className,
    variant,
    size,
    font_size,
    hover,
    keepHovered = false,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    } & Props) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(
                buttonVariants({ variant, size, font_size, hover, className }),
                keepHovered && "neo-hover-forced",
            )}
            {...props}
        />
    );
}

export { Button, buttonVariants };
