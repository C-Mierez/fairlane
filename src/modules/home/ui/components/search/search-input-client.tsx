"use client";

import { type ComponentProps, useState } from "react";

import { Input } from "@components/ui/input";
import useDebounce from "@hooks/use-debounce";
import useProductFilters from "@modules/products/ui/hooks/use-product-filters";

export default function SearchInputClient({ ...props }: ComponentProps<typeof Input>) {
    const [filters, setFilters] = useProductFilters();
    const [input, setInput] = useState(filters.search ?? "");

    useDebounce(input, 1000, (value) => {
        setFilters((prev) => ({ ...prev, search: value }));
    });

    return (
        <Input
            {...props}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
            }}
            value={input ?? ""}
            className="!rounded-l-none !border-l-0"
            focus={"none"}
        />
    );
}
