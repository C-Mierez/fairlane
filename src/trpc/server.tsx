import "server-only";

import { cache } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

/**
 * https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr
 * The benefit of this is that you can call getQueryClient() to get a hold of this client anywhere that gets called from a Server Component, including utility functions. The downside is that every time you call dehydrate(getQueryClient()), you serialize the entire queryClient, including queries that have already been serialized before and are unrelated to the current Server Component which is unnecessary overhead.
 */
export const getQueryClient = cache(makeQueryClient);

export const trpcCaller = createCallerFactory(appRouter)(createTRPCContext);

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
