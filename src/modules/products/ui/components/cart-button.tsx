"use client";

import Link from "next/link";

import { Button } from "@components/ui/button";
import { buildLibraryUrl } from "@lib/urls";
import useCart from "@modules/checkout/hooks/use-cart";

interface Props {
    isAlreadyPurchased?: boolean;
    tenantSlug: string;
    productId: string;
    isExpanded?: boolean;
}

export default function CartButton({ tenantSlug, productId, isExpanded, isAlreadyPurchased }: Props) {
    const cart = useCart(tenantSlug);

    function onClickHandler() {
        cart.toggleProduct(productId);
    }

    if (isAlreadyPurchased) {
        return (
            <Button size={isExpanded ? "expanded" : "default"} className="h-10" asChild>
                <Link prefetch href={buildLibraryUrl(productId)}>
                    Go to Library
                </Link>
            </Button>
        );
    }

    return (
        <Button
            size={isExpanded ? "expanded" : "default"}
            border={cart.isProductInCart(productId) ? "neo" : "transparent"}
            variant={cart.isProductInCart(productId) ? "default" : "inverted"}
            hover={cart.isProductInCart(productId) ? "ghost" : "ghost_inverted"}
            className="h-10"
            onClick={onClickHandler}
        >
            {cart.isProductInCart(productId) ? "Remove from Cart" : "Add to Cart"}
        </Button>
    );
}
