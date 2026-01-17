"use client";

import { createContext, use } from "react";

import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useQuery } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";

/**
 * Based on https://github.dev/payloadcms/payload/tree/main/examples/auth
 */

interface AuthContext {
    user?: inferRouterOutputs<AppRouter>["auth"]["session"];
}

const Context = createContext({} as AuthContext);

interface Props {
    children: React.ReactNode;
}

export function AuthProviderClient({ children }: Props) {
    // Use TRPC Session endpoints to get the user and permissions
    const trpc = useTRPC();
    const { data: userData } = useQuery(trpc.auth.session.queryOptions());

    return (
        <Context
            value={{
                user: userData,
            }}
        >
            {children}
        </Context>
    );
}

type UseAuth = () => AuthContext;

export const useAuth: UseAuth = () => use(Context);
