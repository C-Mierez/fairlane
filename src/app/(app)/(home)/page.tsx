import { withCategoryFilters } from "@/hocs/with-category-filters";
import ProductSearchView from "@modules/products/ui/views/product-search-view";

async function HomePage() {
    return <ProductSearchView />;
}

export default withCategoryFilters(HomePage);
