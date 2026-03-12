import type { Sort, Where } from "payload";

import type { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { GetByFiltersSchema } from "../schema";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
    getOneById: baseProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const product = await ctx.payload.findByID({
                collection: "products",
                id: input.id,
                depth: 2,
            });

            let isPurchased = false;
            if (ctx.session.user) {
                const ordersData = await ctx.payload.find({
                    collection: "orders",
                    pagination: false,
                    limit: 1,
                    where: {
                        and: [
                            {
                                product: {
                                    equals: input.id,
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

                isPurchased = ordersData.totalDocs > 0;
            }

            const reviews = await ctx.payload.find({
                collection: "reviews",
                pagination: false,
                where: {
                    product: {
                        equals: input.id,
                    },
                },
            });

            const reviewRating =
                reviews.docs.length > 0
                    ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.docs.length
                    : 0;

            const ratingAggregation: Record<number, number> = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            };

            if (reviews.totalDocs > 0) {
                reviews.docs.forEach((review) => {
                    const rating = review.rating;

                    if (rating >= 1 && rating <= 5) {
                        ratingAggregation[rating] = (ratingAggregation[rating] || 0) + 1;
                    }
                });

                Object.keys(ratingAggregation).forEach((key) => {
                    const rating = Number(key);
                    const count = ratingAggregation[rating] || 0;

                    ratingAggregation[rating] = Math.round((count / reviews.totalDocs) * 100);
                });
            }

            return {
                ...product,
                image: product.image as Media | null, // Cast is possible because query has depth 2
                category: product.category as Category, // Cast is possible because query has depth 2
                tenant: product.tenant as Tenant & { image: Media | null }, // Cast is possible because query has depth 2 and Tenant is required
                isPurchased,
                reviewRating,
                reviewCount: reviews.totalDocs,
                ratingAggregation,
            };
        }),

    getAll: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.payload.find({
            collection: "products",
            depth: 1, // Get the Category data as well
            sort: "name",
        });

        return data;
    }),

    getInfiniteByFilters: baseProcedure.input(GetByFiltersSchema).query(async ({ ctx, input }) => {
        const where: Where = {};
        let sort: Sort = "-createdAt";

        if (input.sort) {
            switch (input.sort) {
                case "trending":
                    sort = "-createdAt";
                    break;
                case "price_asc":
                    sort = "price";
                    break;
                case "price_desc":
                    sort = "-price";
                    break;
                case "name_asc":
                    sort = "name";
                    break;
                case "name_desc":
                    sort = "-name";
                    break;
            }
        }

        if (input.minPrice && input.maxPrice) {
            where["price"] = {
                greater_than_equal: input.minPrice,
                less_than_equal: input.maxPrice,
            };
        } else if (input.minPrice) {
            where["price"] = {
                greater_than_equal: input.minPrice,
            };
        } else if (input.maxPrice) {
            where["price"] = {
                less_than_equal: input.maxPrice,
            };
        }

        if (input.tags && input.tags.length > 0) {
            where["tags.name"] = {
                in: input.tags,
            };
        }

        if (input.tenantSlug) {
            where["tenant.slug"] = {
                equals: input.tenantSlug,
            };
        }

        if (input.categorySlug) {
            // Get the inputted category's children slugs, if any
            const queriedCategory = await ctx.payload.find({
                collection: "categories",
                where: {
                    slug: {
                        equals: input.categorySlug,
                    },
                },
                select: {
                    children: true,
                },
                depth: 1, // Populate the children
                pagination: false,
            });

            if (queriedCategory.totalDocs === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Category with slug ${input.categorySlug} not found`,
                });
            }

            const existingCategory = queriedCategory.docs[0];
            let childrenSlugs: string[] = [];
            if (existingCategory && existingCategory.children) {
                childrenSlugs =
                    existingCategory.children.docs?.map(
                        (child) => (child as Category).slug, // Casting is possible because query has depth 1
                    ) || [];
            }

            where["category.slug"] = {
                in: [input.categorySlug, ...childrenSlugs],
            };
        }

        const data = await ctx.payload.find({
            collection: "products",
            depth: 2, // Get the Category, Tenant, Media data as well
            where,
            sort,
            page: input.cursor,
            limit: input.limit,
        });

        const dataWithAggregatedReviews = await Promise.all(
            data.docs.map(async (doc) => {
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
            ...data,
            docs: dataWithAggregatedReviews.map((doc) => ({
                ...doc,
                image: doc.image as Media | null, // Cast is possible because query has depth 2
                tenant: doc.tenant as Tenant & { image: Media | null }, // Cast is possible because query has depth 2 and Tenant is required
            })),
        };
    }),
});
