"use client";

import { useQueryStates } from "nuqs";

import { ProductFiltersKeys, ProductFiltersParser } from "./product-filter-parsers";

export type { ProductFiltersType } from "./product-filter-parsers";
export { loadProductFilters, ProductFiltersKeys } from "./product-filter-parsers";

export default function useProductFilters() {
    return useQueryStates(ProductFiltersParser, {
        urlKeys: ProductFiltersKeys,
    });
}
