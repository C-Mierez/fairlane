import BrandLogo from "@components/brand-logo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@components/ui/sidebar";

import { ctaItems, navbarItems } from "./content";
import { NavbarCTA } from "./navbar-cta";

export default function NavbarMenu() {
    return (
        <>
            <SidebarTrigger size={"icon"} />

            <Sidebar className="font-brand" side="left">
                <SidebarHeader className="border-b-neo">
                    <BrandLogo href={"/"} variant={"md"} />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarMenu className="gap-0">
                        {navbarItems.map((items) => (
                            <SidebarMenuItem key={items.name} className="border-b-neo">
                                <SidebarMenuButton className="rounded-none">{items.name}</SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="gap-0 p-0">
                    <div className="flex flex-col">
                        {ctaItems.map((item, index) => (
                            <NavbarCTA
                                key={item.name}
                                item={item}
                                isAlt={index === 1}
                                className="border-t-neo border-l-0"
                            />
                        ))}
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}
