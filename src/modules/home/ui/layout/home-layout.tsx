import { getPayload } from "payload";

import { Category } from "@/payload-types";
import { SidebarProvider } from "@components/ui/sidebar";
import configPromise from "@payload-config";

import HomeNavbar from "../components/navbar/home-navbar";
import SearchFilters from "../components/search/search-filters";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
    const payload = await getPayload({
        config: configPromise,
    });

    const data = await payload.find({
        collection: "categories",
        where: {
            childOf: {
                exists: false,
            },
        },
        depth: 1,
        pagination: false,
        sort: "name",
    });

    const formattedData: FormattedCategories = data.docs.map((doc) => ({
        ...doc,
        children: (doc.children?.docs ?? []).map((child) => ({
            ...(child as Category), // Depth is 1
            children: undefined,
        })),
    }));

    return (
        <SidebarProvider>
            <HomeNavbar />
            <SearchFilters data={formattedData} />
            {children}
        </SidebarProvider>
    );
}

export type FormattedCategories = (Category & {
    children: (Category & {
        children: undefined;
    })[];
})[];
