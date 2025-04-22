import SearchCategories from "./search-categories";
import SearchFilterContainer from "./search-filter-container";
import SearchInput from "./search-input";

export default function SearchFilters() {
    return (
        <section>
            <SearchFilterContainer>
                <SearchInput />
                <SearchCategories />
            </SearchFilterContainer>
        </section>
    );
}
