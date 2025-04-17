import { ComponentProps } from "react";

import { cva, VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";

import { cn } from "@lib/utils";

const variants = cva("font-brand-black uppercase", {
    variants: {
        variant: {
            default: "text-4xl leading-8",
            md: "text-lg",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export default function BrandLogo({
    variant,
    className,
    ...props
}: LinkProps & ComponentProps<"a"> & VariantProps<typeof variants>) {
    return (
        <Link className={cn(variants({ variant, className }))} {...props}>
            Fairlane
        </Link>
    );
}
