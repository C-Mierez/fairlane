import SearchCategories from "./search-categories";
import SearchInput from "./search-input";

export default function SearchFilters() {
    return (
        <section>
            <div className="border-b-neo grid w-full">
                <SearchInput />
                <SearchCategories />
            </div>
        </section>
    );
}
