import type { Media, Tenant } from "@/payload-types";
import { authedProcedure, createTRPCRouter } from "@/trpc/init";
import { PaginationSchema } from "@lib/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const libraryRouter = createTRPCRouter({
    getOne: authedProcedure
        .input(
            z.object({
                productId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const ordersData = await ctx.payload.find({
                collection: "orders",
                limit: 1,
                pagination: false,
                where: {
                    and: [
                        {
                            product: {
                                equals: input.productId,
                            },
                        },
                        {
                            user: {
                                equals: ctx.session.user.id,
                            },
                        },
                    ],
                },
            });

            const order = ordersData.docs[0];

            if (!order) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Order not found in library",
                });
            }

            const productData = await ctx.payload.findByID({
                collection: "products",
                id: input.productId,
            });

            if (!productData) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                });
            }

            return {
                ...productData,
            };
        }),
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

        const dataWithAggregatedReviews = await Promise.all(
            productsData.docs.map(async (doc) => {
                const reviewsData = await ctx.payload.find({
                    collection: "reviews",
                    pagination: false,
                    where: {
                        product: {
                            equals: doc.id,
                        },
                    },
                });

                return {
                    ...doc,
                    reviewCount: reviewsData.totalDocs,
                    reviewRating:
                        reviewsData.docs.length === 0
                            ? 0
                            : reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) /
                              reviewsData.docs.length,
                };
            }),
        );

        return {
            ...productsData,
            docs: dataWithAggregatedReviews.map((doc) => ({
                ...doc,
                image: doc.image as Media | null, // Cast is possible because query has depth 2
                tenant: doc.tenant as Tenant & { image: Media | null }, // Cast is possible because query has depth 2 and Tenant is required
            })),
        };
    }),
});
