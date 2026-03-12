"use client";

import { cn } from "@lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";

interface Props {
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    className?: string;
}

export default function StarPicker({ value, onChange, disabled, className }: Props) {
    const [hoverValue, setHoverValue] = useState(0);

    return (
        <div
            className={cn(
                "flex items-center",
                disabled && "pointer-events-none cursor-not-allowed opacity-50",
                className,
            )}
        >
            {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                    key={starValue}
                    type="button"
                    disabled={disabled}
                    className={cn("p-0.5 transition hover:scale-110", !disabled && "cursor-pointer")}
                    onClick={() => onChange?.(starValue)}
                    onPointerEnter={() => setHoverValue(starValue)}
                    onPointerLeave={() => setHoverValue(0)}
                >
                    <StarIcon
                        className={cn(
                            "size-6",
                            hoverValue >= starValue || (value && value >= starValue)
                                ? "fill-neutral-900 stroke-neutral-900"
                                : "stroke-neutral-900",
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
