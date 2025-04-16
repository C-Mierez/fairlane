import Link from "next/link";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

import { ctaItems, navbarItems } from "./content";

export default function HomeNavbar() {
    return (
        <section className="bg-background border-b-neo h-header font-brand grid grid-cols-10 items-center text-lg">
            <Link href={"/"} className="col-span-2 flex size-full items-center pl-8">
                <div className="font-brand-black text-4xl leading-8 uppercase">Fairlane</div>
            </Link>
            <nav className="col-span-6">
                <ul className="flex justify-center gap-2">
                    {navbarItems.map((item) => (
                        <NavbarItem key={item.name} item={item} />
                    ))}
                </ul>
            </nav>
            <div className="col-span-2 grid h-full grid-cols-2">
                {/* TODO Add href */}
                {ctaItems.map((item, index) => (
                    <NavbarCTA key={item.name} item={item} isAlt={index === 1}></NavbarCTA>
                ))}
            </div>
        </section>
    );
}

interface NavbarItemProps {
    item: (typeof navbarItems)[number];
}

function NavbarItem({ item }: NavbarItemProps) {
    return (
        <li>
            <Button asChild variant="nav" hover={"ghost"}>
                <Link href={item.href}>{item.name}</Link>
            </Button>
        </li>
    );
}

interface NavbarCTAProps {
    item: (typeof ctaItems)[number];
    isAlt?: boolean;
}

function NavbarCTA({ item, isAlt }: NavbarCTAProps) {
    return (
        <Button asChild variant={isAlt ? "primaryAlt" : "primary"} hover={"none"} size={"expanded"}>
            <Link href={item.href} className={cn("border-l-neo")}>
                {item.name}
            </Link>
        </Button>
    );
}
