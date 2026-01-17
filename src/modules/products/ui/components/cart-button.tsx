"use client";

import { Button } from "@components/ui/button";
import useCart from "@modules/checkout/hooks/use-cart";

interface Props {
    tenantSlug: string;
    productId: string;
    isExpanded?: boolean;
}

export default function CartButton({ tenantSlug, productId, isExpanded }: Props) {
    const cart = useCart(tenantSlug);

    function onClickHandler() {
        cart.toggleProduct(productId);
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
