import { z } from "zod";

import type { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const checkoutRouter = createTRPCRouter({
    getProducts: baseProcedure
        .input(
            z.object({
                productIds: z.array(z.string()),
            }),
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.payload.find({
                collection: "products",
                depth: 2, // Get the Category data as well
                sort: "name",
                where: {
                    id: {
                        in: input.productIds,
                    },
                },
            });

            if (data.totalDocs !== input.productIds.length) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "One or more products not found",
                });
            }

            return {
                ...data,
                totalPrice: data.docs.reduce((acc, product) => acc + (product.price || 0), 0),
                docs: data.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null, // Cast is possible because query has depth 2
                    tenant: doc.tenant as Tenant & { image: Media | null }, // Cast is possible because query has depth 2 and Tenant is required
                })),
            };
        }),
});
