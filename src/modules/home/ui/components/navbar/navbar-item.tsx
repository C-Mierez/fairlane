import Link from "next/link";

import { Button } from "@components/ui/button";

import type { NavbarItemType } from "./content";

interface Props {
    item: NavbarItemType;
}

export function NavbarItem({ item }: Props) {
    return (
        <Button hover={"ghost"} font_size={"lg"} asChild>
            <Link href={item.href}>{item.name}</Link>
        </Button>
    );
}
