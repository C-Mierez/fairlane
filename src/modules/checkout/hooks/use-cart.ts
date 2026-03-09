import { useCallback } from "react";
import { useCartStore, type TenantCart } from "../store/use-cart-store";
import { useShallow } from "zustand/react/shallow";

export default function useCart(tenantSlug: TenantCart["productIds"][0]) {
    // const { addProduct, clearAllCarts, clearCart, getCartByTenant, removeProduct } = useCartStore();

    const addProduct = useCartStore((state) => state.addProduct);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);
    const clearCart = useCartStore((state) => state.clearCart);
    const removeProduct = useCartStore((state) => state.removeProduct);

    const productIds = useCartStore(useShallow((state) => state.allCarts[tenantSlug]?.productIds || []));

    const isProductInCart = useCallback(
        (productId: string) => {
            return productIds.includes(productId);
        },
        [productIds],
    );

    const toggleProduct = useCallback(
        (productId: string) => {
            if (isProductInCart(productId)) {
                removeProduct(tenantSlug, productId);
            } else {
                addProduct(tenantSlug, productId);
            }
        },
        [addProduct, removeProduct, tenantSlug, isProductInCart],
    );

    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug);
    }, [clearCart, tenantSlug]);

    const handleAddProduct = useCallback(
        (productId: string) => {
            addProduct(tenantSlug, productId);
        },
        [addProduct, tenantSlug],
    );

    const handleRemoveProduct = useCallback(
        (productId: string) => {
            removeProduct(tenantSlug, productId);
        },
        [removeProduct, tenantSlug],
    );

    return {
        productIds,
        addProduct: handleAddProduct,
        removeProduct: handleRemoveProduct,
        isProductInCart,
        toggleProduct,
        clearTenantCart,
        clearAllCarts,
        totalItems: productIds.length,
    };
}
