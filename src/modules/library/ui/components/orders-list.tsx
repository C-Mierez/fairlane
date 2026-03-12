"use client";

import { InboxIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import InfiniteLoader from "@components/infinite-loader";
import { Skeleton } from "@components/ui/skeleton";
import SuspenseWithError from "@components/utils/suspended";
import { DEFAULT_PAGINATION_LIMIT } from "@lib/schema";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import OrdersCard from "./oders-card";

export default function OrderGrid() {
    return (
        <SuspenseWithError fallback={<OrderListSkeleton />}>
            <OrderListSuspense />
        </SuspenseWithError>
    );
}

function OrderListSuspense() {
    const trpc = useTRPC();

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
        trpc.library.getInfinite.infiniteQueryOptions(
            {
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
                        {flattenedData.map((order) => (
                            <OrdersCard
                                key={order.id}
                                id={order.id}
                                name={order.name}
                                imageUrl={order.image?.url}
                                tenantSlug={order.tenant.slug}
                                tenantImageUrl={order.tenant.image?.url}
                                reviewCount={order.reviewCount}
                                reviewRating={order.reviewRating}
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
                    <span className="text-muted-foreground text-sm">No Orders found</span>
                </div>
            )}
        </div>
    );
}

function OrderListSkeleton() {
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
