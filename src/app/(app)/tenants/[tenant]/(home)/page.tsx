import { withCategoryFilters, type WithCategoryFiltersProps } from "@/hocs/with-category-filters";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

async function TenantPage(props: WithCategoryFiltersProps) {
    return <ProductSearchView {...props} />;
}

export default withCategoryFilters(TenantPage);
