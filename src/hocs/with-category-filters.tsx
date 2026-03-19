import type { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import { loadProductFilters } from "@modules/products/ui/hooks/product-filter-parsers";

export type WithCategoryFiltersProps = {
    categorySlug?: string;
    subcategorySlug?: string;
    tenantSlug?: string;
};
type Props = {
    params: Promise<{
        category?: string;
        subcategory?: string;
        tenant?: string;
    }>;
    searchParams: Promise<SearchParams>;
};

export function withCategoryFilters<P extends WithCategoryFiltersProps>(Component: React.ComponentType<P>) {
    return async function WithCategoryFilters(props: Props) {
        const { category: categorySlug, subcategory: subcategorySlug, tenant: tenantSlug } = await props.params;
        const { minPrice, maxPrice, tags, sort } = await loadProductFilters(props.searchParams);

        prefetch(
            trpc.products.getInfiniteByFilters.infiniteQueryOptions(
                {
                    categorySlug: subcategorySlug || categorySlug,
                    minPrice,
                    maxPrice,
                    tags,
                    sort,
                    tenantSlug,
                    limit: DEFAULT_PAGINATION_LIMIT,
                },
                {
                    getNextPageParam: (lastPage) => (lastPage.docs.length > 0 ? lastPage.nextPage : undefined),
                },
            ),
        );

        prefetch(
            trpc.tags.getInfinite.infiniteQueryOptions(
                {
                    limit: DEFAULT_PAGINATION_LIMIT,
                },
                {
                    getNextPageParam: (lastPage) => (lastPage.docs.length > 0 ? lastPage.nextPage : undefined),
                },
            ),
        );

        const componentProps = {
            categorySlug,
            subcategorySlug,
            tenantSlug,
        } as unknown as P;

        return (
            <HydrateClient>
                <Component {...componentProps} />
            </HydrateClient>
        );
    };
}
