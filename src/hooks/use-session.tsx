"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * Gets the current session from the server
 * Uses ``useSuspenseQuery`` to suspend the component until the session is loaded
 * @returns session The current session
 */
export function useSession() {
    const trpc = useTRPC();
    // const session = useSuspenseQuery(trpc.test.boolean.queryOptions({ value: true }));
    const session = useSuspenseQuery(trpc.auth.session.queryOptions());

    const { data, error, isError, ...rest } = session;
    return {
        session: data,
        error,
        isError,
        query: rest,
    };
}
