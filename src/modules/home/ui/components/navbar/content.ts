export type NavbarItemType = {
    name: string;
    href: string;
};

// TODO Add real href
export const navbarItems: NavbarItemType[] = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About",
        href: "/about",
    },
    {
        name: "Features",
        href: "/features",
    },
    {
        name: "Pricing",
        href: "/pricing",
    },
    {
        name: "Contact",
        href: "/contact",
    },
];

export type NavbarCTAType = {
    name: string;
    href: string;
};

// TODO Add real href
export const ctaItems: NavbarCTAType[] = [
    {
        name: "Log In",
        href: "/login",
    },
    {
        name: "Start",
        href: "/dashboard",
    },
];
