import BrandLogo from "@components/brand-logo";

import { navbarItems } from "./content";
import NavbarCTAWrapper from "./navbar-cta-wrapper";
import { NavbarItem } from "./navbar-item";
import NavbarMenu from "./navbar-menu";

export default function HomeNavbar() {
    return (
        <section className="bg-background border-b-neo h-header font-brand sticky top-0 right-0 left-0 z-50 grid w-full grid-cols-12 items-center">
            <div className="col-span-3 flex size-full items-center pl-4 md:pl-8">
                <BrandLogo href={"/"} />
            </div>

            <nav className="col-span-6 hidden lg:block">
                <ul className="flex justify-center gap-2">
                    {navbarItems.map((item) => (
                        <li key={item.name}>
                            <NavbarItem item={item} />
                        </li>
                    ))}
                </ul>
            </nav>
            <ul className="col-span-3 hidden h-full grid-cols-2 lg:grid xl:col-start-11">
                <NavbarCTAWrapper />
            </ul>

            {/* Mobile Menu */}
            <div className="col-span-4 col-start-9 flex items-center justify-end pr-4 md:pr-8 lg:hidden">
                <NavbarMenu />
            </div>
        </section>
    );
}
