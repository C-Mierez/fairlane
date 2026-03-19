"use client";

import { InboxIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import InfiniteLoader from "@components/infinite-loader";
import { Skeleton } from "@components/ui/skeleton";
import SuspenseWithError from "@components/utils/suspended";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import useProductFilters from "../hooks/use-product-filters";
import ProductCard from "./product-card";

interface Props {
    categorySlug?: string;
    tenantSlug?: string;
}

export default function ProductGrid(props: Props) {
    return (
        <SuspenseWithError fallback={<ProductListSkeleton />}>
            <ProductListSuspense {...props} />
        </SuspenseWithError>
    );
}

function ProductListSuspense({ categorySlug, tenantSlug }: Props) {
    const [filters] = useProductFilters();

    const trpc = useTRPC();

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
        trpc.products.getInfiniteByFilters.infiniteQueryOptions(
            {
                categorySlug,
                tenantSlug,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                tags: filters.tags,
                sort: filters.sort,
                search: filters.search,
                limit: DEFAULT_PAGINATION_LIMIT,
            },
            {
                getNextPageParam: (lastPage) => (lastPage.docs.length > 0 ? lastPage.nextPage : undefined),
            },
        ),
    );

    const flattenedData = data.pages.flatMap((page) => page.docs);

    return (
        <div className="flex flex-col gap-4">
            {flattenedData.length > 0 ? (
                <>
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {flattenedData.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                imageUrl={product.image?.url}
                                tenantSlug={product.tenant.slug}
                                tenantImageUrl={product.tenant.image?.url}
                                reviewCount={product.reviewCount}
                                reviewRating={product.reviewRating}
                            />
                        ))}
                    </ul>
                    <InfiniteLoader
                        isFetchingNextPage={isFetchingNextPage}
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                </>
            ) : (
                <div className="bg-background neo-container grid place-items-center p-4">
                    <InboxIcon className="size-4" />
                    <span className="text-muted-foreground text-sm">No Products found</span>
                </div>
            )}
        </div>
    );
}

function ProductListSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[438/632]" />
                ))}
            </ul>
        </div>
    );
}
