import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import LibraryProductView from "@modules/library/ui/views/library-product-view";

interface Props {
    params: Promise<{
        productId: string;
    }>;
}

export default async function LibraryProductPage({ params }: Props) {
    const { productId } = await params;

    prefetch(
        trpc.library.getOne.queryOptions({
            productId,
        }),
    );

    prefetch(
        trpc.reviews.getOne.queryOptions({
            productId,
        }),
    );

    return (
        <HydrateClient>
            <LibraryProductView productId={productId} />
        </HydrateClient>
    );
}
