import { withCategoryFilters, type WithCategoryFiltersProps } from "@/hocs/with-category-filters";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

async function CategoryPage({ categorySlug }: WithCategoryFiltersProps) {
    return <ProductSearchView categorySlug={categorySlug} />;
}

export default withCategoryFilters(CategoryPage);
