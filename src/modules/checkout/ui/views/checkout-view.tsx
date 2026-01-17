"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import useCart from "@modules/checkout/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";

import CheckoutDetails from "../components/checkout-details";
import CheckoutList from "../components/checkout-list";

interface Props {
    tenantSlug: string;
}

export default function CheckoutView({ tenantSlug }: Props) {
    const { productIds, clearAllCarts } = useCart(tenantSlug);

    const trpc = useTRPC();

    const { data, error } = useQuery(
        trpc.checkout.getProducts.queryOptions({
            productIds: productIds,
        }),
    );

    useEffect(() => {
        if (error?.data?.code === "NOT_FOUND") {
            clearAllCarts();
            toast.warning("Some products in your cart are no longer available and have been removed.");
        }
    }, [error, clearAllCarts]);

    return (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-4 md:p-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <CheckoutList tenantSlug={tenantSlug} />
            </div>
            <CheckoutDetails totalPrice={data?.totalPrice || 0} />
        </section>
    );
}
