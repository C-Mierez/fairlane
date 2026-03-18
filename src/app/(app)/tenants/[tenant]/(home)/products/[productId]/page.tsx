import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import ProductNavbar from "@modules/products/ui/components/product-navbar";
import ProductView from "@modules/products/ui/views/product-view";

interface Props {
    params: Promise<{
        tenant: string;
        productId: string;
    }>;
}

export default async function ProductPage({ params }: Props) {
    const { productId, tenant: tenantSlug } = await params;

    void prefetch(trpc.products.getOneById.queryOptions({ id: productId }));

    return (
        <HydrateClient>
            {/* <SuspenseWithError fallback={<div>Loading...</div>} error={<div>Failed to load product</div>}> */}
            <ProductNavbar productId={productId} tenantSlug={tenantSlug} />
            <ProductView productId={productId} tenantSlug={tenantSlug} />
            {/* </SuspenseWithError> */}
        </HydrateClient>
    );
}
