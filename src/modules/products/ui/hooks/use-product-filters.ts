import { ProductSortSchema } from "@modules/products/schema";
import type { UrlKeys } from "nuqs";
import { useQueryStates } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";

const ProductFiltersParser = {
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    sort: parseAsStringLiteral(ProductSortSchema.options).withDefault("trending"),
};

export type ProductFiltersType = typeof ProductFiltersParser;

export const ProductFiltersKeys: UrlKeys<ProductFiltersType> = {
    minPrice: "min",
    maxPrice: "max",
    tags: "tags",
    sort: "sort",
};

export const loadProductFilters = createLoader(ProductFiltersParser);

export default function useProductFilters() {
    return useQueryStates(ProductFiltersParser, {
        urlKeys: ProductFiltersKeys,
    });
}
