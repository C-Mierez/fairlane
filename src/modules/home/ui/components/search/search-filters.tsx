import { PaginatedDocs } from "payload";

import { Category } from "@/payload-types";

import SearchInput from "./search-input";
import SearchCategories from "./search-categories";

interface SearchFiltersProps {
    data: PaginatedDocs<Category>;
}

export default function SearchFilters({ data }: SearchFiltersProps) {
    return (
        <section>
            <div className="border-b-neo grid w-full place-items-center gap-6 px-8 py-4">
                <SearchInput />
                <SearchCategories data={data} />
            </div>
        </section>
    );
}
