"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import useCart from "@modules/checkout/hooks/use-cart";
import useCheckoutStates from "@modules/checkout/hooks/use-checkout-states";
import { useMutation, useQuery } from "@tanstack/react-query";

import CheckoutDetails from "../components/checkout-details";
import CheckoutList from "../components/checkout-list";

interface Props {
    tenantSlug: string;
}

export default function CheckoutView({ tenantSlug }: Props) {
    const { productIds, clearTenantCart } = useCart(tenantSlug);

    const router = useRouter();

    const [checkoutStates, setCheckoutStates] = useCheckoutStates();

    const trpc = useTRPC();

    const { data, error } = useQuery(
        trpc.checkout.getProducts.queryOptions({
            productIds: productIds,
        }),
    );

    const purchaseProducts = useMutation(
        trpc.checkout.purchaseProducts.mutationOptions({
            onMutate: () => {
                setCheckoutStates({
                    success: false,
                    cancel: false,
                });
            },
            onSuccess: (data) => {
                window.location.href = data.url;
            },
            onError: (error) => {
                if (error.data?.code === "UNAUTHORIZED") {
                    // TODO Adapt to subdomains
                    router.push("/sign-in");
                }
            },
        }),
    );

    const onPurchase = () => {
        purchaseProducts.mutate({
            productIds: productIds,
            tenantSlug: tenantSlug,
        });
    };

    useEffect(() => {
        if (error?.data?.code === "NOT_FOUND") {
            clearTenantCart();
            toast.warning("Some products in your cart are no longer available and have been removed.");
        }
    }, [error, clearTenantCart]);

    useEffect(() => {
        if (checkoutStates.success) {
            setCheckoutStates({
                success: false,
                cancel: false,
            });
            clearTenantCart();
            // TODO Invalidate library

            router.push("/");
        }
    }, [checkoutStates.success, clearTenantCart, router, setCheckoutStates]);

    return (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-4 md:p-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <CheckoutList tenantSlug={tenantSlug} />
            </div>
            <CheckoutDetails
                totalPrice={data?.totalPrice || 0}
                onPurchase={onPurchase}
                isLoading={purchaseProducts.isPending}
                didCancel={checkoutStates.cancel}
            />
        </section>
    );
}
