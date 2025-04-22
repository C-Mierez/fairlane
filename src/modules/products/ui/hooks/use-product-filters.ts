import type { UrlKeys } from "nuqs";
import { useQueryStates } from "nuqs";
import { createLoader, parseAsInteger } from "nuqs/server";

const ProductFiltersParser = {
    minPrice: parseAsInteger.withOptions({
        clearOnDefault: true,
    }),
    maxPrice: parseAsInteger.withOptions({
        clearOnDefault: true,
    }),
};

export type ProductFiltersType = typeof ProductFiltersParser;

export const ProductFiltersKeys: UrlKeys<ProductFiltersType> = {
    minPrice: "min",
    maxPrice: "max",
};

export const loadProductFilters = createLoader(ProductFiltersParser);

export default function useProductFilters() {
    return useQueryStates(ProductFiltersParser, {
        urlKeys: ProductFiltersKeys,
    });
}
