"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@components/ui/button";
import { ProductSortSchema, type ProductSortType } from "@modules/products/schema";

import useProductFilters from "../hooks/use-product-filters";

type SortData = {
    label: string;
    value: ProductSortType;
    order: "asc" | "desc" | null;
};

function createSortData(sort: ProductSortType): SortData {
    switch (sort) {
        case "trending":
            return {
                label: "Trending",
                value: sort,
                order: null,
            };
        case "price_asc":
            return {
                label: "Price (Asc)",
                value: sort,
                order: "asc",
            };
        case "price_desc":
            return {
                label: "Price (Desc)",
                value: sort,
                order: "desc",
            };
        case "name_asc":
            return {
                label: "Name (A to Z)",
                value: sort,
                order: "asc",
            };
        case "name_desc":
            return {
                label: "Name (Z to A)",
                value: sort,
                order: "desc",
            };
    }
}

export default function ProductSort() {
    const [filters, setFilters] = useProductFilters();

    return (
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1">
            <li aria-hidden className="invisible hidden lg:block"></li>
            {ProductSortSchema.options.map((sort) => {
                const { label, value, order } = createSortData(sort);
                const isActive = filters.sort === value;
                return (
                    <li key={value} className="flex items-center gap-2">
                        <Button
                            variant={"default"}
                            size={"expanded"}
                            rise={"neo"}
                            shadow={isActive ? "neo" : "none"}
                            border={"neo"}
                            hover={"none"}
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    sort: value,
                                });
                            }}
                        >
                            {label}
                            {!!order && (order === "asc" ? <ArrowUp /> : <ArrowDown />)}
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
}
