import { cookies, headers as getHeaders } from "next/headers";
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { LoginSchema, RegisterSchema, UsernameSchema } from "../schema";
import { buildPayloadCookieKey, checkUsername, loginUser } from "./shared";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();

        const session = await ctx.payload.auth({ headers });

        return session;
    }),

    register: baseProcedure.input(RegisterSchema).mutation(async ({ ctx, input }) => {
        const res = await ctx.payload.create({
            collection: "users",
            data: {
                email: input.email,
                password: input.password, // Payload handles the password hashing
                username: input.username,
            },
        });

        if (!res) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "No user returned",
            });
        }

        const user = await loginUser(ctx, {
            email: res.email,
            password: input.password,
        });

        return user;
    }),

    login: baseProcedure.input(LoginSchema).mutation(async ({ ctx, input }) => {
        const user = await loginUser(ctx, input);

        return user;
    }),

    logout: baseProcedure.mutation(async ({ ctx }) => {
        const c = await cookies();

        c.delete(buildPayloadCookieKey(ctx.payload));
    }),

    /* ------------------------------ Restrictions ------------------------------ */
    checkUsername: baseProcedure
        .input(
            z.object({
                username: UsernameSchema,
            }),
        )
        .query(async ({ ctx, input }) => {
            return await checkUsername(ctx, input.username);
        }),
});
