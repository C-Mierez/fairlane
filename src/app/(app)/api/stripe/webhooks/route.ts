import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { getPayload } from "@lib/server/payload";
import type { CheckoutUserMetadata, ExpandedLineItem } from "@modules/checkout/types";

export async function POST(req: Request) {
    let event: Stripe.Event;

    try {
        // https://docs.stripe.com/webhooks/signature
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get("stripe-signature") as string,
            env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";

        if (err instanceof Error) {
            console.error("Stripe Webhook Error:", errorMessage);
        }

        return NextResponse.json({ message: `Stripe Webhook Error: ${errorMessage}` }, { status: 400 });
    }

    console.log(`✅ Success: ${event.type} event received.`);

    const permittedEvents: Stripe.Event.Type[] = ["checkout.session.completed"];

    const payload = await getPayload();

    if (permittedEvents.includes(event.type)) {
        let data;

        try {
            switch (event.type) {
                case "checkout.session.completed":
                    data = event.data.object as Stripe.Checkout.Session;

                    const metadata = data.metadata as CheckoutUserMetadata | null;

                    if (!metadata?.userId) {
                        throw new Error("No user ID in metadata");
                    }

                    const user = await payload.findByID({
                        collection: "users",
                        id: metadata.userId,
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const expandedSession = await stripe.checkout.sessions.retrieve(data.id, {
                        expand: ["line_items.data.price.product"],
                    });

                    if (!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
                        throw new Error("No line items found in checkout session");
                    }

                    const lineItems = expandedSession.line_items.data as ExpandedLineItem[];

                    for (const item of lineItems) {
                        await payload.create({
                            collection: "orders",
                            data: {
                                stripeCheckoutSessionId: data.id,
                                user: user.id,
                                product: item.price.product.metadata.id,
                                name: item.price.product.name,
                            },
                        });
                    }
                    break;
                default:
                    throw new Error(`Unhandled event type: ${event.type}`);
            }
        } catch (err) {
            console.error("Error handling Stripe webhook:", err);
            return NextResponse.json({ message: `Error handling Stripe webhook` }, { status: 500 });
        }
    }

    return NextResponse.json(
        {
            message: "Webhook received",
        },
        { status: 200 },
    );
}
