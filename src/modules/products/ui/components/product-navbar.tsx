"use client";

import { StarIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import PriceLabel from "@components/price-label";
import SuspenseWithError from "@components/utils/suspended";
import { useSuspenseQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { Button } from "@components/ui/button";

const CartButton = dynamic(() => import("@modules/products/ui/components/cart-button"), {
    ssr: false,
    loading: () => <Button disabled>Add to Cart</Button>,
});

interface Props {
    productId: string;
    tenantSlug: string;
}

export default function ProductNavbar(props: Props) {
    return (
        <SuspenseWithError fallback={<ProductNavbarSkeleton />}>
            <ProductNavbarSuspense {...props} />
        </SuspenseWithError>
    );
}

function ProductNavbarSuspense({ productId, tenantSlug }: Props) {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.products.getOneById.queryOptions({ id: productId }));

    return (
        <header className="border-b-neo bg-background sticky top-[var(--height-header)] right-0 left-0 z-100 hidden justify-center px-4 md:flex md:px-8">
            <div className="flex h-18 w-full max-w-7xl items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                    <PriceLabel price={data.price} />
                    <h1 className="font-brand-bold text-xl font-bold">{data.name}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-foreground flex items-center gap-2 text-sm">
                        <StarIcon className="fill-foreground size-4" />
                        <p>
                            {/* TODO Proper ratings */}
                            4.3 <span className="text-muted-foreground">(430)</span>
                        </p>
                    </div>

                    {/* TODO Add button functionality */}
                    <CartButton tenantSlug={tenantSlug} productId={productId} />
                </div>
            </div>
        </header>
    );
}

function ProductNavbarSkeleton() {
    return (
        <header className="border-b-neo bg-background sticky top-[var(--height-header)] right-0 left-0 z-100 flex justify-center px-4 md:px-8">
            <div className="h-18 w-full max-w-7xl py-4"></div>
        </header>
    );
}
