import type { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { loadProductFilters } from "@modules/products/ui/hooks/use-product-filters";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

interface Props {
    params: Promise<{
        category: string;
        subcategory: string;
    }>;
    searchParams: Promise<SearchParams>;
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
    const { category: categorySlug, subcategory: subcategorySlug } = await params;
    const { minPrice, maxPrice } = await loadProductFilters(searchParams);

    prefetch(
        trpc.products.getByFilters.queryOptions({
            categorySlug: subcategorySlug,
            minPrice,
            maxPrice,
        }),
    );

    return (
        <HydrateClient>
            <ProductSearchView categorySlug={categorySlug} subcategorySlug={subcategorySlug} />
        </HydrateClient>
    );
}
