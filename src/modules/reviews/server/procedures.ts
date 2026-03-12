import { authedProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
    getOne: authedProcedure
        .input(
            z.object({
                productId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.productId,
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                });
            }

            const reviewsData = await ctx.payload.find({
                collection: "reviews",
                limit: 1,
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

            const review = reviewsData.docs[0];

            if (!review) {
                return null;
            }

            return {
                ...review,
            };
        }),

    createOrUpdate: authedProcedure
        .input(
            z.object({
                productId: z.string(),
                rating: z.number().min(1).max(5),
                description: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.productId,
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                });
            }

            const existingReview = await ctx.payload.find({
                collection: "reviews",
                limit: 1,
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

            // Update the review if it already exists, otherwise create a new one
            let review;
            if (existingReview.docs[0]) {
                review = await ctx.payload.update({
                    collection: "reviews",
                    id: existingReview.docs[0].id,
                    data: {
                        rating: input.rating,
                        description: input.description,
                    },
                });
            } else {
                review = await ctx.payload.create({
                    collection: "reviews",
                    data: {
                        product: input.productId,
                        user: ctx.session.user.id,
                        rating: input.rating,
                        description: input.description,
                    },
                });
            }

            return review;
        }),
});
