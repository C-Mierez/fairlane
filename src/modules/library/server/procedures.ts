import type { Media, Tenant } from "@/payload-types";
import { authedProcedure, createTRPCRouter } from "@/trpc/init";
import { PaginationSchema } from "@lib/schema";

export const libraryRouter = createTRPCRouter({
    getInfinite: authedProcedure.input(PaginationSchema).query(async ({ ctx, input }) => {
        const data = await ctx.payload.find({
            collection: "orders",
            depth: 0, // We only get the IDs
            page: input.cursor,
            limit: input.limit,
            where: {
                user: {
                    equals: ctx.session.user.id,
                },
            },
        });

        const productIds = data.docs.map((order) => order.product);

        const productsData = await ctx.payload.find({
            collection: "products",
            pagination: false,
            where: {
                id: {
                    in: productIds,
                },
            },
        });

        return {
            ...productsData,
            docs: productsData.docs.map((doc) => ({
                ...doc,
                image: doc.image as Media | null, // Cast is possible because query has depth 2
                tenant: doc.tenant as Tenant & { image: Media | null }, // Cast is possible because query has depth 2 and Tenant is required
            })),
        };
    }),
});
