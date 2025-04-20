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
        <Button asChild variant={isAlt ? "primaryAlt" : "primary"} hover={"none"} size={"expanded"} font_size={"lg"}>
            <Link href={item.href} className={className ? className : "border-l-neo"}>
                {item.name}
            </Link>
        </Button>
    );
}
