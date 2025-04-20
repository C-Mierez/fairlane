import Link from "next/link";

import { Button } from "@components/ui/button";

import type { NavbarItemType } from "./content";

interface NavbarItemProps {
    item: NavbarItemType;
}

export function NavbarItem({ item }: NavbarItemProps) {
    return (
        <Button asChild variant="nav" hover={"ghost"} font_size={"lg"}>
            <Link href={item.href}>{item.name}</Link>
        </Button>
    );
}
