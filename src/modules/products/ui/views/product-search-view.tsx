import ProductFilters from "../components/product-filters";
import ProductGrid from "../components/product-list";

interface Props {
    categorySlug?: string;
    subcategorySlug?: string;
}

export default function ProductSearchView({ categorySlug, subcategorySlug }: Props) {
    return (
        <section className="relative grid grid-cols-1 gap-4 px-4 md:px-8 lg:grid-cols-6 xl:grid-cols-8">
            <search className="sticky top-[var(--height-header)] h-fit py-4 lg:col-span-2">
                <ProductFilters />
            </search>
            <div className="min-h-[200vh] py-4 lg:col-span-4 xl:col-span-6">
                <ProductGrid categorySlug={subcategorySlug || categorySlug} />
            </div>
        </section>
    );
}
