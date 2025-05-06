"use client";

import { useTRPC } from "@/trpc/client";
import InfiniteLoader from "@components/infinite-loader";
import { Skeleton } from "@components/ui/skeleton";
import SuspenseWithError from "@components/utils/suspended";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import useProductFilters from "../hooks/use-product-filters";
import ProductCard from "./product-card";
import { InboxIcon } from "lucide-react";

interface Props {
    categorySlug?: string;
}

export default function ProductGrid(props: Props) {
    return (
        <SuspenseWithError fallback={<ProductListSkeleton />}>
            <ProductListSuspense {...props} />
        </SuspenseWithError>
    );
}

function ProductListSuspense({ categorySlug }: Props) {
    const [filters] = useProductFilters();

    const trpc = useTRPC();

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
        trpc.products.getInfiniteByFilters.infiniteQueryOptions(
            {
                categorySlug,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                tags: filters.tags,
                sort: filters.sort,
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
                                authorUsername={product.tenant.name}
                                authorImageUrl={product.tenant.image?.url}
                                reviewCount={435} // TODO Get the real review rating
                                reviewRating={4.5} // TODO Get the real review rating
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
