import type { Stripe } from "stripe";
import { z } from "zod";

import { env } from "@/env";
import type { Media, Tenant } from "@/payload-types";
import { authedProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { STRIPE_FEE_PERCENTAGE } from "@lib/constants";
import { stripe } from "@lib/stripe";
import { buildCheckoutUrl } from "@lib/urls";
import { TRPCError } from "@trpc/server";

import type { CheckoutUserMetadata, ProductMetadata } from "../types";

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
                    and: [
                        {
                            id: {
                                in: input.productIds,
                            },
                        },
                        {
                            isArchived: {
                                not_equals: true,
                            },
                        },
                    ],
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

    /* -------------------------------- Mutation -------------------------------- */
    verify: authedProcedure.mutation(async ({ ctx }) => {
        const user = await ctx.payload.findByID({
            collection: "users",
            id: ctx.session.user.id,
            depth: 0,
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        const tenantId = user.tenants?.[0]?.tenant as string; // Guaranteed by the depth 0
        const tenant = await ctx.payload.findByID({
            collection: "tenants",
            id: tenantId,
        });

        if (!tenant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Tenant not found",
            });
        }

        const accountLink = await stripe.accountLinks.create({
            account: tenant.stripeAccountId,
            refresh_url: `${env.NEXT_PUBLIC_WEBSITE_URL}/admin`,
            return_url: `${env.NEXT_PUBLIC_WEBSITE_URL}/admin`,
            type: "account_onboarding",
        });

        if (!accountLink.url) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to create Stripe account link",
            });
        }

        return {
            url: accountLink.url,
        };
    }),
    purchaseProducts: authedProcedure
        .input(
            z.object({
                productIds: z.array(z.string().min(1)),
                tenantSlug: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const products = await ctx.payload.find({
                collection: "products",
                depth: 2,
                where: {
                    and: [
                        {
                            id: {
                                in: input.productIds,
                            },
                        },
                        {
                            "tenant.slug": {
                                equals: input.tenantSlug,
                            },
                        },
                        {
                            isArchived: {
                                not_equals: true,
                            },
                        },
                    ],
                },
            });

            if (products.totalDocs !== input.productIds.length) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "One or more products not found for the specified tenant",
                });
            }

            const tenantsData = await ctx.payload.find({
                collection: "tenants",
                where: {
                    slug: {
                        equals: input.tenantSlug,
                    },
                },
            });

            const tenant = tenantsData.docs[0];

            if (!tenant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not found",
                });
            }

            // Throw error if Stripe details are not submitted
            if (!tenant.stripeDetailsSubmitted) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Tenant has not completed Stripe onboarding",
                });
            }

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map((product) => ({
                quantity: 1,
                price_data: {
                    unit_amount: product.price * 100, // Stripe expects amount in cents
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        metadata: {
                            stripeAccountId: tenant.stripeAccountId,
                            id: product.id,
                            name: product.name,
                            price: product.price,
                        } as ProductMetadata,
                    },
                },
            }));

            const totalAmount = products.docs.reduce((acc, item) => acc + item.price * 100, 0);

            const platformFeeAmount = Math.round((totalAmount * STRIPE_FEE_PERCENTAGE) / 100);

            const checkout = await stripe.checkout.sessions.create(
                {
                    customer_email: ctx.session.user.email,
                    success_url: `${buildCheckoutUrl(input.tenantSlug, { success: "true" })}`,
                    cancel_url: `${buildCheckoutUrl(input.tenantSlug, { cancel: "true" })}`,
                    mode: "payment",
                    line_items: lineItems,
                    invoice_creation: {
                        enabled: true,
                    },
                    metadata: {
                        userId: ctx.session.user.id,
                    } as CheckoutUserMetadata,
                    payment_intent_data: {
                        application_fee_amount: platformFeeAmount,
                    },
                },
                {
                    stripeAccount: tenant.stripeAccountId,
                },
            );

            if (!checkout.url) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create checkout session",
                });
            }

            return {
                url: checkout.url,
            };
        }),
});
