import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import ProductList from "@modules/products/ui/components/product-list";

interface Props {
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage({ params }: Props) {
    const { category: categorySlug } = await params;

    prefetch(
        trpc.products.getByCategory.queryOptions({
            categorySlug,
        }),
    );

    return (
        <HydrateClient>
            <ProductList categorySlug={categorySlug} />
        </HydrateClient>
    );
}
