import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import type { Media } from "@/payload-types";

export const tenantsRouter = createTRPCRouter({
    getBySlug: baseProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
        const tenants = await ctx.payload.find({
            collection: "tenants",
            where: {
                slug: {
                    equals: input.slug,
                },
            },
            depth: 1,
            limit: 1,
            pagination: false,
        });

        const tenant = tenants.docs[0];

        if (!tenant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Tenant with slug ${input.slug} not found`,
            });
        }

        return {
            ...tenant,
            image: tenant.image as Media | null, // Depth is 1, so image is always Media or null
        };
    }),
});
