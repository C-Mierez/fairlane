import type { WithCategoryFiltersProps } from "@/hocs/with-category-filters";

import ProductFilters from "../components/product-filters";
import ProductGrid from "../components/product-list";
import ProductSort from "../components/product-sort";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends WithCategoryFiltersProps {}

export default function ProductSearchView({ categorySlug, subcategorySlug, tenantSlug }: Props) {
    return (
        <section>
            <div className="flex flex-col justify-between gap-4 px-4 pt-6 pb-4 md:px-8 lg:flex-row lg:items-end">
                <span className="font-brand-medium shrink-0 text-xl font-medium">Curated for you</span>
                <ProductSort />
            </div>
            <div className="relative grid grid-cols-1 gap-4 px-4 md:px-8 lg:grid-cols-6 xl:grid-cols-8">
                <search className="bg-background-alt sticky top-[var(--height-header)] z-10 h-fit pt-4 lg:col-span-2">
                    <ProductFilters />
                </search>
                <div className="py-4 lg:col-span-4 xl:col-span-6">
                    <ProductGrid categorySlug={subcategorySlug || categorySlug} tenantSlug={tenantSlug} />
                </div>
            </div>
        </section>
    );
}
