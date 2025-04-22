"use client";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { formatAsCurrency, sanitizeStringAsNumber } from "@lib/utils";
import type { ChangeEvent } from "react";

interface Props {
    minPrice: string | null;
    maxPrice: string | null;
    onMinPriceChange: (value: number | null) => void;
    onMaxPriceChange: (value: number | null) => void;
}

export default function PriceFilter({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: Props) {
    function handleChange(onChange?: (value: number | null) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const sanitizedValue = sanitizeStringAsNumber(e.target.value);

            const numericValue = sanitizedValue ? parseFloat(sanitizedValue) : null;

            onChange?.(numericValue);
        };
    }

    return (
        <ul>
            <li className="flex flex-col gap-2 px-4 py-4">
                <Label>Minimum Price</Label>
                <Input
                    type="text"
                    placeholder="0"
                    value={minPrice ? formatAsCurrency(minPrice) : ""}
                    onChange={handleChange(onMinPriceChange)}
                />
            </li>
            <li className="flex flex-col gap-2 px-4 py-4">
                <Label>Maximum Price</Label>
                <Input
                    type="text"
                    placeholder="∞"
                    value={maxPrice ? formatAsCurrency(maxPrice) : ""}
                    onChange={handleChange(onMaxPriceChange)}
                />
            </li>
        </ul>
    );
}
