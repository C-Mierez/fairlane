import ProductSearchView from "@modules/products/ui/views/product-search-view";

async function HomePage() {
    return (
        <>
            <ProductSearchView />
        </>
    );
}

// export default withCategoryFilters(HomePage);
export default HomePage;
