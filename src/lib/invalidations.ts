import type { AppRouter } from "@/trpc/routers/_app";
import type { QueryClient } from "@tanstack/react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

export async function invalidateOnSignIn(queryClient: QueryClient, trpc: TRPCOptionsProxy<AppRouter>) {
    await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
}
