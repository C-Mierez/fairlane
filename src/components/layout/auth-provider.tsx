import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { AuthProviderClient } from "./auth-provider-client";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    prefetch(trpc.auth.session.queryOptions());

    return (
        <HydrateClient>
            <AuthProviderClient>{children}</AuthProviderClient>
        </HydrateClient>
    );
}
