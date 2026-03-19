import type { ComponentProps } from "react";

import {
    SearchIcon,
    ShoppingBagIcon,
} from "lucide-react";

import { Button } from "@components/ui/button";
import type { Input } from "@components/ui/input";

import LibraryButton from "../library-button";
import SearchInputClient from "./search-input-client";

export default function SearchInput(props: ComponentProps<typeof Input>) {
    return (
        <div className="flex w-full items-stretch justify-between gap-4 px-4 pt-4 pb-3 md:px-8">
            <div className="rounded-base flex w-full items-stretch justify-between focus-within:ring-1 focus-within:ring-black focus-within:ring-offset-3 focus-within:outline-hidden">
                <span className="neo-container !border-r-none bg-background grid aspect-square size-10 place-items-center !rounded-r-none">
                    <SearchIcon className="size-4" />
                </span>
               
    <SearchInputClient
      {...props}
    />
  
            </div>
            <LibraryButton />
            <Button>
                <ShoppingBagIcon className="size-6" />
                {/* TODO Add proper number */}
                <span>0</span>
            </Button>
        </div>
    );
}


      


      
   