import { Category } from "@/payload-types";
import { PaginatedDocs } from "payload";
import SearchCategoriesDropdown from "./search-categories-dropdown";

interface SearchCategoriesProps {
    data: PaginatedDocs<Category>;
}

export default function SearchCategories({ data }: SearchCategoriesProps) {
    return (
        <div className="flex gap-4">
            {data.docs.map((category) => (
                <div key={category.id}>
                    <SearchCategoriesDropdown category={category} isActive={false} isNavigationHovered={false} />
                </div>
            ))}
            {/* <div>{JSON.stringify(data, null, 2)}</div> */}
        </div>
    );
}
