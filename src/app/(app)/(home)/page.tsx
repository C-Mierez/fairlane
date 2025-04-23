import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

export default async function HomePage() {
    prefetch(
        trpc.products.getByFilters.queryOptions({
            categorySlug: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            tags: undefined,
            sort: undefined,
        }),
    );

    prefetch(
        trpc.tags.getInfinite.infiniteQueryOptions({
            limit: DEFAULT_PAGINATION_LIMIT,
        }),
    );

    return (
        <HydrateClient>
            <ProductSearchView />
        </HydrateClient>
    );
}
