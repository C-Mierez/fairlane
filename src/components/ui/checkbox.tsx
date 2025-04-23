"use client";

import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

import { Check } from "lucide-react";

import { cn } from "@lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

const Checkbox = forwardRef<
    ElementRef<typeof CheckboxPrimitive.Root>,
    ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer border-foreground focus-visible:ring-ring data-[state=checked]:bg-foreground data-[state=checked]:text-background rounded-base h-4 w-4 shrink-0 border focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
            <Check className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
