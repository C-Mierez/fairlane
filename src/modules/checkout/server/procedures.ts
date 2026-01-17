import { z } from "zod";

import type { Media, Tenant } from "@/payload-types";
import { authedProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import type { Stripe } from "stripe";
import type { CheckoutUserMetadata, ProductMetadata } from "../types";
import { stripe } from "@lib/stripe";
import { env } from "@/env";
import { buildCheckoutUrl, buildTenantUrl } from "@lib/urls";

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

    /* -------------------------------- Mutation -------------------------------- */
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

            // TODO Throw error if Stripe details are not submitted

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

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user.email,
                success_url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${buildCheckoutUrl(input.tenantSlug, { success: "true" })}`,
                cancel_url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${buildCheckoutUrl(input.tenantSlug, { cancel: "true" })}`,
                mode: "payment",
                line_items: lineItems,
                invoice_creation: {
                    enabled: true,
                },
                metadata: {
                    userId: ctx.session.user.id,
                } as CheckoutUserMetadata,
            });

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
