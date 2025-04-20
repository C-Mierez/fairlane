import "server-only";

import { cache } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy, TRPCQueryOptions } from "@trpc/tanstack-react-query";

import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);

export const trpc = createTRPCOptionsProxy({
    ctx: createTRPCContext,
    router: appRouter,
    queryClient: getQueryClient,
});

// Used server-side for component trees where data is prefetched
export function HydrateClient(props: { children: React.ReactNode }) {
    const qc = getQueryClient();

    return <HydrationBoundary state={dehydrate(qc)}>{props.children}</HydrationBoundary>;
}

// Used for prefetching data in server components
// eslint-disable-next-line
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === "infinite") {
        // eslint-disable-next-line
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}
