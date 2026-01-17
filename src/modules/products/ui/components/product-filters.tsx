"use client";

import { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@components/ui/button";

import useProductFilters, { type ProductFiltersType } from "../hooks/use-product-filters";
import PriceFilter from "./filters/price-filter";
import TagsFilter from "./filters/tags-filter";

interface Props {
    categorySlug?: string;
}

export default function ProductFilters({}: Props) {
    const [filters, setFilters] = useProductFilters();

    function handleChange(key: keyof ProductFiltersType, value: unknown) {
        setFilters({
            ...filters,
            [key]: value,
        });
    }

    function handleClear() {
        setFilters({
            minPrice: null,
            maxPrice: null,
            tags: null,
        });
    }

    const showClearButton = Object.entries(filters).some(([key, val]) => {
        if (key === "sort") return false; // Don't show clear button for sort

        if (Array.isArray(val)) return val.length > 0;

        if (typeof val === "number") return val > 0;
    });

    return (
        <div className="neo-container bg-background flex flex-col overflow-hidden">
            <header className="border-b-neo flex items-center justify-between gap-2 p-4">
                <span>Filters</span>
                <Button
                    variant={"link"}
                    size={"sm"}
                    rise={"none"}
                    border={"transparent"}
                    hover={"ghost"}
                    onClick={handleClear}
                    className={!showClearButton ? "invisible" : ""}
                >
                    Clear
                </Button>
            </header>

            <ul>
                <Filter title="Price" isActive={!!filters.minPrice || !!filters.maxPrice}>
                    <PriceFilter
                        minPrice={filters.minPrice?.toString() || null}
                        maxPrice={filters.maxPrice?.toString() || null}
                        onMinPriceChange={(value) => handleChange("minPrice", value)}
                        onMaxPriceChange={(value) => handleChange("maxPrice", value)}
                    />
                </Filter>
                <Filter title="Tags" isActive={!!filters.tags && filters.tags.length > 0}>
                    <TagsFilter tags={filters.tags} onTagsChange={(value) => handleChange("tags", value)} />
                </Filter>
            </ul>
        </div>
    );
}

interface FilterProps {
    title: string;
    isActive: boolean;
    children: React.ReactNode;
}

function Filter({ title, children, isActive }: FilterProps) {
    const [isOpen, setIsOpen] = useState(isActive);

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
                variant={isOpen || isActive ? "inverted" : "default"}
                className="justify-between text-base"
            >
                <span className="line-clamp-1">{title}</span>
                {isOpen ? <ChevronDown /> : <ChevronRight />}
            </Button>
            {isOpen && children}
        </li>
    );
}
