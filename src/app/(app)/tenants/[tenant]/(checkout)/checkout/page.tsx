import { HydrateClient } from "@/trpc/server";
import CheckoutNavbar from "@modules/checkout/ui/components/checkout-navbar";
import CheckoutView from "@modules/checkout/ui/views/checkout-view";

interface Props {
    params: Promise<{
        tenant: string;
    }>;
}

export default async function CheckoutPage(props: Props) {
    const { tenant } = await props.params;

    return (
        <HydrateClient>
            <CheckoutNavbar tenantSlug={tenant} />
            <CheckoutView tenantSlug={tenant} />
        </HydrateClient>
    );
}
