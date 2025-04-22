import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import ProductList from "@modules/products/ui/components/product-list";

interface Props {
    params: Promise<{
        category: string;
        subcategory: string;
    }>;
}

export default async function SubcategoryPage({ params }: Props) {
    const { subcategory: subcategorySlug } = await params;

    prefetch(
        trpc.products.getByCategory.queryOptions({
            categorySlug: subcategorySlug,
        }),
    );

    return (
        <HydrateClient>
            <ProductList categorySlug={subcategorySlug} />
        </HydrateClient>
    );
}
