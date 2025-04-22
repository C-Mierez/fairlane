"use client";

import { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@components/ui/button";

import useProductFilters, { type ProductFiltersType } from "../hooks/use-product-filters";
import PriceFilter from "./filters/price-filter";

interface Props {
    categorySlug?: string;
}

export default function ProductFilters({ categorySlug }: Props) {
    const [filters, setFilters] = useProductFilters();

    function handleChange(key: keyof ProductFiltersType, value: number | null) {
        setFilters({
            ...filters,
            [key]: value,
        });
    }

    function handleClear() {
        setFilters({
            minPrice: null,
            maxPrice: null,
        });
    }

    const showClearButton = Object.entries(filters).some(([, val]) => {
        return !!val;
    });

    return (
        <div className="neo-container bg-background flex flex-col overflow-hidden">
            <header className="border-b-neo flex items-center justify-between gap-2 p-4">
                <span>Filters</span>
                {showClearButton && (
                    <Button
                        variant={"link"}
                        size={"sm"}
                        rise={"none"}
                        border={"transparent"}
                        hover={"ghost"}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                )}
            </header>

            <ul>
                <Filter title="Price">
                    <PriceFilter
                        minPrice={filters.minPrice?.toString() || null}
                        maxPrice={filters.maxPrice?.toString() || null}
                        onMinPriceChange={(value) => handleChange("minPrice", value)}
                        onMaxPriceChange={(value) => handleChange("maxPrice", value)}
                    />
                </Filter>
            </ul>
        </div>
    );
}

interface FilterProps {
    title: string;
    children: React.ReactNode;
}

function Filter({ title, children }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleClick() {
        setIsOpen((prev) => !prev);
    }

    return (
        <li className="flex flex-col">
            <Button
                onClick={handleClick}
                size={"expanded"}
                border={"none"}
                rise={"none"}
                radius={"none"}
                hover={"to_foreground"}
                variant={isOpen ? "inverted" : "default"}
                className="justify-between text-base"
            >
                <span className="line-clamp-1">{title}</span>
                {isOpen ? <ChevronDown /> : <ChevronRight />}
            </Button>
            {isOpen && children}
        </li>
    );
}
