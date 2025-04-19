import { FormattedCategories } from "../../layout/home-layout";
import SearchCategories from "./search-categories";
import SearchInput from "./search-input";

interface SearchFiltersProps {
    data: FormattedCategories;
}

export default function SearchFilters({ data }: SearchFiltersProps) {
    return (
        <section>
            <div className="border-b-neo grid w-full">
                <SearchInput />
                <SearchCategories data={data} />
            </div>
        </section>
    );
}
