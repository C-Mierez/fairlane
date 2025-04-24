import { withCategoryFilters, type WithCategoryFiltersProps } from "@/hocs/with-category-filters";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

async function SubcategoryPage({ categorySlug, subcategorySlug }: WithCategoryFiltersProps) {
    return <ProductSearchView categorySlug={categorySlug} subcategorySlug={subcategorySlug} />;
}

export default withCategoryFilters(SubcategoryPage);
