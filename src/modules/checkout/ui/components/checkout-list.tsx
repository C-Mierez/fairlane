"use client";

import { useTRPC } from "@/trpc/client";
import useCart from "@modules/checkout/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";

import CheckoutListItem from "./checkout-list-item";
import { Loader2Icon } from "lucide-react";

interface Props {
    tenantSlug: string;
}

export default function CheckoutList({ tenantSlug }: Props) {
    const { productIds } = useCart(tenantSlug);

    const trpc = useTRPC();

    const { data, isLoading } = useQuery(
        trpc.checkout.getProducts.queryOptions({
            productIds: productIds,
        }),
    );

    if (isLoading) {
        return (
            <div className="bg-background neo-container grid h-fit place-items-center p-4">
                <Loader2Icon className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-background neo-container h-fit overflow-hidden">
            {data?.docs.map((product, i) => <CheckoutListItem key={i} tenantSlug={tenantSlug} product={product} />)}
        </div>
    );
}
