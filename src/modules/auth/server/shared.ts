import { cookies } from "next/headers";
import type z from "zod";

import type { Context } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import type { LoginSchema } from "../schema";
import type { BasePayload } from "payload";
import { env } from "@/env";

export function buildPayloadCookieKey(payload: BasePayload) {
    return `${payload.config.cookiePrefix}-token`;
}

export async function loginUser(ctx: Context, input: z.infer<typeof LoginSchema>) {
    const res = await ctx.payload.login({
        collection: "users",
        data: {
            email: input.email,
            password: input.password,
        },
    });

    if (!res.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
        });
    }

    if (!res.token) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No session returned",
        });
    }

    const c = await cookies();

    c.set(buildPayloadCookieKey(ctx.payload), res.token, {
        httpOnly: true,
        path: "/",
        ...(env.NODE_ENV !== "development" && {
            sameSite: "none",
            domain: env.NEXT_PUBLIC_ROOT_DOMAIN,
            secure: true,
        }),
    });

    return res;
}

export async function checkUsername(ctx: Context, username: string) {
    const res = await ctx.payload.find({
        collection: "users",
        where: {
            username: {
                equals: username,
            },
        },
    });

    if (res.docs.length > 0) {
        return false;
    }

    return true;
}
