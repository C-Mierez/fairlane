import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TenantCart = {
    productIds: string[];
};

type TenantCartState = {
    allCarts: Record<string, TenantCart>;
};

type TenantCartActions = {
    addProduct: (tenantSlug: string, productId: string) => void;
    removeProduct: (tenantSlug: string, productId: string) => void;
    clearCart: (tenantSlug: string) => void;
    clearAllCarts: () => void;
};

type TenantCartStore = TenantCartState & TenantCartActions;

export const useCartStore = create<TenantCartStore>()(
    persist(
        (set) => ({
            allCarts: {},
            addProduct: (tenantSlug, productId) =>
                set((state) => ({
                    allCarts: {
                        ...state.allCarts,
                        [tenantSlug]: {
                            productIds: [...(state.allCarts[tenantSlug]?.productIds || []), productId],
                        },
                    },
                })),
            removeProduct: (tenantSlug, productId) =>
                set((state) => ({
                    allCarts: {
                        ...state.allCarts,
                        [tenantSlug]: {
                            productIds:
                                (state.allCarts[tenantSlug]?.productIds || []).filter((id) => id !== productId) || [],
                        },
                    },
                })),
            clearCart: (tenantSlug) =>
                set((state) => ({
                    allCarts: {
                        ...state.allCarts,
                        [tenantSlug]: {
                            productIds: [],
                        },
                    },
                })),
            clearAllCarts: () =>
                set(() => ({
                    allCarts: {},
                })),
        }),
        {
            name: "fairlane-cart",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
