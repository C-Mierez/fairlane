import { headers as getHeaders } from "next/headers";
import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { stripe } from "@lib/stripe";
import { TRPCError } from "@trpc/server";

import { LoginSchema, RegisterSchema, UsernameSchema } from "../schema";
import { checkUsername, loginUser } from "./shared";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ ctx }) => {
        const headers = await getHeaders();

        const session = await ctx.payload.auth({ headers });

        return session;
    }),

    register: baseProcedure.input(RegisterSchema).mutation(async ({ ctx, input }) => {
        // Check if the username is already taken
        if (!(await checkUsername(ctx, input.username))) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Username already taken",
            });
        }

        // Create an stripe account
        const stripeAccount = await stripe.accounts.create({});

        if (!stripeAccount) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to create Stripe account",
            });
        }

        // Create a tenant for the user
        const tenant = await ctx.payload.create({
            collection: "tenants",
            data: {
                name: input.username,
                slug: input.username,
                stripeAccountId: stripeAccount.id,
            },
        });

        const res = await ctx.payload.create({
            collection: "users",
            data: {
                email: input.email,
                password: input.password, // Payload handles the password hashing
                username: input.username,
                tenants: [
                    {
                        tenant: tenant.id,
                    },
                ],
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
