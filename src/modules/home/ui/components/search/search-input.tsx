import { ComponentProps } from "react";

import { SearchIcon, ShoppingBagIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

interface SearchFiltersProps {}

export default function SearchInput(props: ComponentProps<typeof Input> & SearchFiltersProps) {
    return (
        <div className="flex w-full items-stretch justify-between gap-4">
            <div className="rounded-base flex w-full items-stretch justify-between focus-within:ring-1 focus-within:ring-black focus-within:ring-offset-3 focus-within:outline-hidden">
                <span className="neo-container !border-r-none bg-background grid aspect-square size-10 place-items-center !rounded-r-none">
                    <SearchIcon className="size-4" />
                </span>
                <Input {...props} className="!rounded-l-none !border-l-0" focus={"none"} />
            </div>
            <Button>
                <ShoppingBagIcon className="size-6" />
                {/* TODO Add proper number */}
                <span>0</span>
            </Button>
        </div>
    );
}
