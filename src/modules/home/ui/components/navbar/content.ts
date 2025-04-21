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

export const ctaItems: NavbarCTAType[] = [
    {
        name: "Log In",
        href: "/sign-in",
    },
    {
        name: "Start",
        href: "/sign-up",
    },
];

export const authedCtaItems: NavbarCTAType[] = [
    {
        name: "Dashboard",
        href: "/admin", // TODO Add real href
    },
];
