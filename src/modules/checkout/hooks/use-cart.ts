import { useCartStore, type TenantCart } from "../store/use-cart-store";

export default function useCart(tenantSlug: TenantCart["productIds"][0]) {
    const { addProduct, clearAllCarts, clearCart, getCartByTenant, removeProduct } = useCartStore();

    const productIds = getCartByTenant(tenantSlug);

    const isProductInCart = (productId: string) => {
        return productIds.includes(productId);
    };

    const toggleProduct = (productId: string) => {
        if (isProductInCart(productId)) {
            removeProduct(tenantSlug, productId);
        } else {
            addProduct(tenantSlug, productId);
        }
    };

    const clearTenantCart = () => {
        clearCart(tenantSlug);
    };

    return {
        productIds,
        addProduct: (productId: string) => addProduct(tenantSlug, productId),
        removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
        isProductInCart,
        toggleProduct,
        clearTenantCart,
        clearAllCarts,
        totalItems: productIds.length,
    };
}
