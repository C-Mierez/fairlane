import type { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { loadProductFilters } from "@modules/products/ui/hooks/use-product-filters";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

interface Props {
    params: Promise<{
        category: string;
    }>;
    searchParams: Promise<SearchParams>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { category: categorySlug } = await params;
    const { minPrice, maxPrice } = await loadProductFilters(searchParams);

    prefetch(
        trpc.products.getByFilters.queryOptions({
            categorySlug,
            minPrice,
            maxPrice,
        }),
    );

    return (
        <HydrateClient>
            <ProductSearchView categorySlug={categorySlug} />
        </HydrateClient>
    );
}
