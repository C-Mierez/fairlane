import type { UrlKeys } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { ProductSortSchema } from "@modules/products/schema";

export const ProductFiltersParser = {
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
