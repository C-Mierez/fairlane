import Link from "next/link";

import { Button } from "@components/ui/button";

import type { NavbarCTAType } from "./content";

interface NavbarCTAProps {
    item: NavbarCTAType;
    isAlt?: boolean;
    className?: string;
}

export function NavbarCTA({ item, isAlt, className }: NavbarCTAProps) {
    return (
        <Button
            asChild
            variant={isAlt ? "inverted" : "default"}
            hover={"to_primary"}
            size={"expanded"}
            border={"none"}
            radius={"none"}
            rise={"none"}
            font_size={"lg"}
        >
            <Link href={item.href} className={className ? className : isAlt ? "" : "border-x-neo"}>
                {item.name}
            </Link>
        </Button>
    );
}
