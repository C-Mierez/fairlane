"use client";

import type { CheckoutGetProductsOutput } from "@/trpc/types";
import { Button } from "@components/ui/button";
import { buildProductUrl, buildTenantUrl } from "@lib/urls";
import { formatAsCurrency } from "@lib/utils";
import useCart from "@modules/checkout/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";

interface Props {
    tenantSlug: string;
    product: CheckoutGetProductsOutput["docs"][number];
}

export default function CheckoutListItem({ product, tenantSlug }: Props) {
    const { removeProduct } = useCart(tenantSlug);

    return (
        <div className="border-t-neo flex justify-between gap-4 first:border-t-0">
            <Link className="border-r-neo relative h-35 w-35" href={buildProductUrl(tenantSlug, product.id)}>
                <Image className="object-cover" src={product.image?.url || ""} alt={product.name} fill />
            </Link>

            <div className="flex flex-1 flex-col justify-between py-4">
                <div>
                    <Link className="font-bold underline" href={buildProductUrl(tenantSlug, product.id)}>
                        {product.name}
                    </Link>
                    <span className="text-muted-foreground line-clamp-2 text-sm">{product.description}</span>
                </div>
                <span>
                    <Button variant={"link"} border={"none"} rise={"none"} size={"link"} asChild className="block">
                        <Link href={buildTenantUrl(tenantSlug)}>{product.tenant.name}</Link>
                    </Button>
                </span>
            </div>

            <div className="flex flex-col items-end justify-between py-4 pr-4">
                <span className="font-bold">{formatAsCurrency(product.price.toString())}</span>
                <Button
                    variant={"link"}
                    border={"none"}
                    rise={"none"}
                    size={"link"}
                    onClick={() => removeProduct(product.id)}
                >
                    Remove
                </Button>
            </div>
        </div>
    );
}
